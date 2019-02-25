from . import _capsule
from .DockMaster import DockMaster
from .Apps.utility import utility

class CapsuleManager(object):
    """
    Individual Capsules manage their Jobs. CapsuleManager manages Capsules and maybe DockMaster???
    """
    Dockmaster = DockMaster.DockMaster()
    Dockmaster.start_shift()

    def __init__(self, capsules = {}, active_capsule = None):
        self.capsules = capsules
        self.active_capsule = None

    def create_capsule(self, capsule_name):
        capsule = _capsule.Capsule(name = capsule_name)
        self.capsules[capsule.id] = capsule
        return self.capsules[capsule.id]

    def set_active_capsule(self, capsule_id):
        self.active_capsule = self.capsules[capsule_id]
        return self.active_capsule.get_capsule_dictionary()

    def get_capsules(self):
        """
        capsule_list = []

        for capsule_id in self.capsules:
            capsule_list.append(self.capsules[capsule_id].get_capsule_dictionary())

        return capsule_list
        """
        capsule_dictionary = {}

        for capsule_id in self.capsules:
            capsule_dictionary[capsule_id] = self.capsules[capsule_id].get_capsule_dictionary()

        return capsule_dictionary

    def dockmaster_job(self, capsule, job, after_function_dictionary = {}):
        storage_kwarg_dictionary = {}

        if after_function_dictionary:

            #Some functions passed from a class will be wrapped in a tuple
            function = after_function_dictionary["function"]
            if type(function) == tuple:
                function = function[0]

            storage_kwarg_dictionary = {
                "after_function" : function,
                "after_function_kwarg_dictionary" : after_function_dictionary["kwarg_dictionary"]            
            }

        self.Dockmaster.post_job(job = job, results_storage = {
            "storage_function" : capsule.store_job_results,
            "storage_kwarg_dictionary" : storage_kwarg_dictionary
            })

        capsule.status = "Running"
        capsule.most_recent_job = job.get_serializable()

    def post_to_dockmaster(self, capsule_dictionary, job_dictionary, after_function_dictionary = {}):
        """
        Parameters:
            capsule_dictionary : Dictionary containing capsule information
                keys : "capsule_id" with the id or "capsule_name" with the name of the new capsule

            job_dictionary : Dictionary containing job initialisers
                required_keys - origin:  String of the origin app.
                                function: The function to be ran in the Dockmaster (passed as a function without () on the end)
                                kwarg_dictionary: A dictionary for passing parameters to the function in dockmaster.
                                method_name: String of the method name (used in frontend capsule display)
        """
        capsule = self.check_dictionaries(capsule_dictionary = capsule_dictionary, job_dictionary = job_dictionary)

        job = capsule.create_job(
            origin = job_dictionary["origin"],
            function = job_dictionary["function"],
            kwarg_dictionary = job_dictionary["kwarg_dictionary"],
            method_name = job_dictionary["method_name"]
        )

        self.dockmaster_job(capsule = capsule, job = job, after_function_dictionary = after_function_dictionary)

        return "success"

    def check_dictionaries(self, capsule_dictionary, job_dictionary):
        required_job_keys = ["origin", "function", "kwarg_dictionary", "method_name"]

        for job_key in required_job_keys:
            if job_key not in job_dictionary:
                raise ValueError("{} key is a required key and was not found in job_dictionary keys {}".format(job_key, list(job_dictionary)))

        if "capsule_id" in capsule_dictionary:
            capsule = self.capsules[capsule_dictionary["capsule_id"]]

        elif "capsule_name" in capsule_dictionary:
            capsule = self.create_capsule(capsule_name = capsule_dictionary["capsule_name"])

        else:
            raise ValueError("'capsule_name' or 'capsule_id' not found in capsule_dictionary keys {}".format(list(capsule_dictionary)))

        return capsule
