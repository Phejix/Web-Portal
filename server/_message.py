import uuid
import datetime

class Message(object):

    def __init__(self, message, url_link):
        self.message = message
        self.id = uuid.uuid4().hex
        self.url_link = url_link
        self.creation_date = datetime.datetime.now().timestamp()
        
        #status can be read/unread.
        self.status = "unread"

    def get_message_dictionary(self):
        return {
            "id" : self.id,
            "message" : self.message,
            "url_link" : self.url_link,
            "creation_date" : self.creation_date,
            "status" : self.status
        }
