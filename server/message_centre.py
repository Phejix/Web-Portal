from . import _message
from .Apps.utility import utility

import datetime

class MessageCentre(object):

        def __init__(self, messages = {}):
            self.messages = messages

        def create_message(self, message, url_link):
            new_message = _message.Message(message = message, url_link = url_link)
            self.messages[new_message.id] = new_message
            return self.messages[new_message.id]

        def delete_message(self, message_id):
            self.messages = utility.remove_key(dictionary = self.messages, key = message_id)

        def get_unread_messages(self):
            unread = []
            
            for message_id in self.messages:
                if self.messages[message_id].status == "unread":
                    unread.append(self.messages[message_id])

            return unread

        def get_datetime_ordered_messages(self, max_amount = None):
            message_list = []

            for message_id in self.messages:
                message_list.append(self.messages[message_id].get_message_dictionary())

            return utility.get_ordered_dictionary_list(dictionary_list = message_list, item_key = "creation_date", reverse = True, max_amount = max_amount)

        def read_messages(self, messages):
            for message in messages:
                message_id = message["id"]
                if message_id in self.messages:
                    if self.messages[message_id].status == "unread":
                        self.messages[message_id].status = "read"

            return "success"