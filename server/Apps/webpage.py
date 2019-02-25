from flask import render_template

from .. import capsule_manager
from .. import message_centre
from .utility import utility

import os
import uuid

class Webpage(object):
    """
    Creates a Webpage object used for rendering templates and
    adding url rules to the flask application

    Parameters:
        template_link: string. Path to the html template, relative to
            the flask template folder. (Found in startup.py)

    Attributes:
        rules_list: string list of urls relevant to the methods used. Add
            to the list using create_rule. 'startup.py' will then use this list
            to add all the rules to the application before deleting the list.
    
    Shared Attributes (among all webpages):
        MessageCentre: Scans for message updates and can be sent from any webpage.
        CapsuleManager: Scans for capsule updates (NOTE: May depreciate/change with database storage coming in)
        ServerState: Temporarily saves the user's state so that webpages appear to retain information. Also allows
                    for apps to pass data to each other via their 'connections'.
                    NOTE: Default Settings (such as settings for SearchLens) are set on their respective pages

        config: Path routes to relevant file folders
    """
    MessageCentre = message_centre.MessageCentre()
    CapsuleManager = capsule_manager.CapsuleManager()
    ServerState = {
        "static" : {},
        "state" : {},
        "connections" : {}
    }

    config = {
                'uploads' : os.path.join(os.getcwd(), "server", "files", "uploads"),
                'downloads' : os.path.join(os.getcwd(), "server", "files", "downloads"),
                'config' : os.path.join(os.getcwd(), 'server', 'files', 'config')
            }


    def __init__(self, template_link):
        self.template_link = template_link
        self.rule_list = []


    def add_url_rules(self, application):
        for rule in self.rule_list:
            application.add_url_rule(rule = rule['rule'], view_func = rule['function'], **rule['kwargs'])

        del self.rule_list


    def get_state(self, app_name):
        state_dictionary = {}

        if app_name in self.ServerState["static"]:
            state_dictionary = {**state_dictionary, **self.ServerState["static"][app_name]}

        if app_name in self.ServerState["state"]:
            state_dictionary = {**state_dictionary, **self.ServerState["state"][app_name]}

        return state_dictionary


    def create_rule(self, url, function, **kwargs):
        self.rule_list.append({"rule" : url, "function" : function, "kwargs" : kwargs})


    def build_connection(self, destination_app, data):
        connection_id = uuid.uuid4().hex
        self.ServerState["connections"][destination_app] = {}
        self.ServerState["connections"][destination_app][connection_id] = data
        return "/{}/connections/{}".format(destination_app, connection_id)


    def get_connection(self, app_name, connection_id):
        if app_name not in self.ServerState["connections"] or connection_id not in self.ServerState["connections"][app_name]:
            raise ValueError("Connection Doesn't Exist")

        data = self.ServerState["connections"][app_name][connection_id]
        self.ServerState["connections"] = utility.remove_key(dictionary = self.ServerState["connections"], key = app_name)

        return data


    def save_state(self, app_name, data):
        for key in data:
            self.ServerState["state"][app_name][key] = data[key]

        return "success"


    def post_to_dockmaster(self, capsule_dictionary, job_dictionary, message_dictionary = {}):
        """
        Used for sending asynchronus job results or combining jobs into one accessible unit.
        Also allows for applications to communicate with each other (e.g. A capsule can be read by Textify which identifies the keywords as text data to be manipulated)

        Parameters:
            capsule_dictionary : Dictionary containing capsule information
                keys : "capsule_id" with the id or "capsule_name" with the name of the new capsule

            job_dictionary : Dictionary containing job initialisers
                required_keys - origin: String representing the origin app's name.

                                function: The function to be ran in the Dockmaster (passed as a function without () on the end)
                                kwarg_dictionary: A dictionary for passing parameters to the function in dockmaster.

            message_dictionary : Dictionary containing kwargs for posting a Message object to the message centre after job is complete.
                required_keys:
                    'message' : String of the message to appear.
                    'url_link' : String of the url that will be linked to when the Message is clicked.
        """
        after_function_dictionary = {}

        if message_dictionary:
            after_function_dictionary["function"] = self.MessageCentre.create_message,
            after_function_dictionary["kwarg_dictionary"] = {
                "message" : message_dictionary["message"],
                "url_link" : message_dictionary["url_link"]
            }

        return self.CapsuleManager.post_to_dockmaster(
            capsule_dictionary = capsule_dictionary,
            job_dictionary = job_dictionary,
            after_function_dictionary = after_function_dictionary
        )