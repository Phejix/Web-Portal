import uuid
import datetime

from .DockMaster import _Job

class Capsule(object):

    def __init__(self, name):
        self.id = uuid.uuid4().hex
        self.name = name
        self.jobs = {}
        self.creation_date = datetime.datetime.now().timestamp()

        #Status can be "Ready" or "Running"
        self.status = "Ready"
        self.most_recent_job = {}

    def get_job(self, job_id):
        return self.jobs[job_id]

    def get_capsule_dictionary(self):
        job_list = []

        for job_id in self.jobs:
            job_list.append(self.jobs[job_id].get_serializable())

        return {
            "id" : self.id,
            "name" : self.name, 
            "jobs" : job_list,
            "status" : self.status,
            "creation_date" : self.creation_date,
            "most_recent_job" : self.most_recent_job
        }

    def create_job(self, origin, function, kwarg_dictionary, method_name, results = None):
        job = _Job.Job(
            origin = origin,
            function = function,
            kwarg_dictionary = kwarg_dictionary,
            results = results,
            method_name = method_name
        )
        
        self.jobs[job.id] = job
        return self.jobs[job.id]

    def store_job_results(self, job, after_function = None, after_function_kwarg_dictionary = {}):
        self.jobs[job.id].results = job.results
        self.status = "Ready"

        if after_function:
            after_function(**after_function_kwarg_dictionary)