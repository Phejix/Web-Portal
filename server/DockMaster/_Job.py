import uuid
import datetime

class Job(object):
    
    def __init__(self, origin, function, kwarg_dictionary, method_name, results = None):
        self.id = uuid.uuid4().hex
        self.function = function
        self.kwarg_dictionary = kwarg_dictionary
        self.results = results
        self.origin = origin
        self.creation_date = datetime.datetime.now().timestamp()
        self.method_name = method_name

    def process_job(self):
        return self.function(**self.kwarg_dictionary)

    def get_job_dictionary(self):
        return {
            "id" : self.id,
            "origin" : self.origin,
            "function" : self.function,
            "kwarg_dictionary" : self.kwarg_dictionary,
            "results" : self.results,
            "creation_date" : self.creation_date,
            "method_name" : self.method_name
        }

    def get_serializable(self):
        return {
            "id" : self.id,
            "origin" : self.origin,
            "results" : self.results,
            "creation_date" : self.creation_date,
            "function" : self.function.__name__,
            "kwarg_dictionary" : self.kwarg_dictionary,
            "method_name" : self.method_name
        }