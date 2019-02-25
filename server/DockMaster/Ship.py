import logging
from multiprocessing import Process, Manager
from threading import Thread
import traceback

class Ship(object):
    """
    A Ship is used to process a function that would otherwise stall a User Interface
    or is okay to work in the background.

    The process is ran and then stored within the ship's container (self.container)
    which is a python dictionary. Errors are also grabbed and stored for reference later.

    Methods must return something that can be stored within a Python Dictionary.

    Attributes:
        ship_id: String/Int. The name of the ship.
        processing_type: String. Type of processing to occur.
        processing_types: String List. The available processing_types. (NOTE: MultiProcessing
        is faster but more tempermental, especially if Thread Locks are held within modules)
    """
    processing_types = ['thread', 'multiprocessing']

    def __init__(self, ship_id, processing_type = 'thread'):
        self.ship_id = ship_id
        self.container = {}

        self.process_type = self.check_process_type(processing_type)

    def set_sail(self, function, kwarg_dict, daemon = True):
        """
        Starts processing the function. Args are passed as
        a keyword args dictionary.
        
        Args:
            function: The Function to run. CANNOT BE PASSED AS LAMBDA.
            kwarg_dict: Dictionary of the keyword arguments of function.
            daemon: Boolean. Only used if using processing_type thread. (Recommended True)
        """
        self.set_processing_variables(function = function, kwarg_dict = kwarg_dict, daemon = daemon)
        self.voyage.start()

    def rejoin_port(self):
        """Called to rejoin the current process after job completion and data saved."""
        self.voyage.join()

    def storage_wrap(self, _passed_function, kwarg_dict, container):
        """Wraps the function in a method that stores the result/error within the ship's container dict"""
        try:
            result = _passed_function(**kwarg_dict)
        except Exception as e:
            result = {"Error Type" : type(e).__name__, "Traceback" : traceback.format_exc().splitlines()[-1], "Full Trace" : traceback.format_exc()}

        container[self.ship_id] = result

    def set_processing_variables(self, function, kwarg_dict, daemon = True):
        """Sets the appropriate processing type and passes on to the storage wrap"""
        if self.process_type == 'thread':
            self.container = {}
            self.voyage = Thread(target = self.storage_wrap, kwargs = self.create_process_kwargs(function = function, kwarg_dict = kwarg_dict), daemon = daemon)

        elif self.process_type == 'multiprocessing':
            self.container = Manager().dict()
            self.voyage = Process(target = self.storage_wrap, kwargs = self.create_process_kwargs(function = function, kwarg_dict = kwarg_dict))

        else:
            raise ProcessTypeError("Unknown Process Type %s", process_type)

    def create_process_kwargs(self, function, kwarg_dict):
        """Utility Function for passing to storage method"""
        return {'_passed_function' : function, 'kwarg_dict' : kwarg_dict, 'container' : self.container}

    def check_process_type(self, process_type):
        if process_type in self.processing_types:
            return process_type
        else:
            raise ProcessTypeError("%s Process Type is Not Supported", process_type)

class ProcessTypeError(Exception):
    pass