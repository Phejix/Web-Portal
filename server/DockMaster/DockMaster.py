import queue
import time
from threading import Thread

from .Port import Port

class DockMaster(object):
    """
    Queues requests and sends methods/results to appropriate
    places to be dealt with separately

    Attributes:
        job_queue: A FIFO queue that handles job requests.
        ship_count: Int. How many ships to create. (Ships handle processes)
        port: A Port object which handles ship status and creation.
        processing_type: String. Either thread or multiprocessing. Defines how the Ships will process data.
                         Multi-processing is faster but less robust.
        manifest: Dictionary. Holds the unique operation ID, the ship processing and the function.
                  In Format: {"Ship Id" : {"Operation ID" : x, "Function" : function}}
        
    """
    
    def __init__(self, ship_count = 10, processing_type = 'thread', daemon = True):
        self.daemon = daemon

        self.job_queue = queue.Queue()
        self.manifest = {}
        self.port = Port(ship_count = ship_count)
        self.working = False

    def start_shift(self):
        self.working = True
        self.shift_thread = Thread(target = self.work_docks, daemon = self.daemon)
        self.shift_thread.start()

    def end_shift(self):
        self.working = False
        self.shift_thread.join()

    def work_docks(self):
        """The threading loop process which checks for updates"""
        while(self.working):
            self.check_job_queue()

            if self.check_sailing_ships():
                self.check_ship_containers()

            time.sleep(2)

    def check_job_queue(self):
        try:
            self.sort_job()
        except queue.Empty:
            pass

    def store_results(self, ship_id):
        job = self.manifest[ship_id]
        self.remove_from_manifest(ship_id = ship_id)
        self.results_storage['storage_function'](job = job, **self.results_storage['storage_kwarg_dictionary'])

    def check_ship_containers(self):
        """
        Checks the manifest for inputs.
        Loops through them to check if ships have finished
        Puts finished results in the results queue.
        Rejoins the threads.
        """
        for ship_id in self.manifest:
            ship = self.port.get_ship(ship_id = ship_id)

            if ship.container:
                self.manifest[ship_id].results = ship.container[ship_id]
                ship.rejoin_port()
                self.port.alter_port_status(ship_id = ship_id)
                self.store_results(ship_id = ship_id)

    def add_to_manifest(self, ship_id, job):
        self.manifest[ship_id] = job

    def remove_from_manifest(self, ship_id):
        self.manifest = self.remove_key(dictionary = self.manifest, key = ship_id)

    def sort_job(self):
        """
        Gets the next job, finds a free ship, adds the ship to manifest and
        sends off the ship.
        """
        next_job = self.job_queue.get_nowait()
        ship_id = self.get_free_ship_id() #Make sure to send an error handle to deal with ShipLimit raised to user in Interface
        ship = self.port.get_ship(ship_id = ship_id)

        self.add_to_manifest(ship_id = ship_id, job = next_job)

        ship.set_sail(function = next_job.function, kwarg_dict = next_job.kwarg_dictionary)
        self.port.alter_port_status(ship_id = ship_id)
        self.job_queue.task_done()

    def get_free_ship_id(self):
        docked_ship_ids = self.port.get_docked_ship_ids()

        if len(docked_ship_ids) > 0:
            return docked_ship_ids[0]
        else:
            raise ShipLimitError("No Free Ships Available")

    def check_sailing_ships(self):
        if len(self.port.get_sailing_ship_ids()) > 0:
            return True
        else:
            return False

    def remove_key(self, dictionary, key):
        temp = dict(dictionary)
        del temp[key]
        return temp

    def post_job(self, job, results_storage):
        """
        Parameters:
            job: A Job object found in job.py in the DockMaster directory
            results_storage: A dictionary with the function to run and a keyword argument for any parameters. Has following keys:
                {'storage_function' : x, 'storage_kwarg_dictionary' : {}}. storage_function will be run with 'job' as a keyword parameter

        Returns:
            True if added to queue.

        Attaches a job to be processed to the DockMaster's queue.
        """
        self.results_storage = results_storage
        self.job_queue.put(item = job, block = True, timeout = 1)
        return True
            
class ShipLimitError(Exception):
    pass
