from . import api_caller, keyword_organiser
from ....utility import connections
from .errors import adwords_errors

class AdwordsInterface(object):

    def __init__(self):
        self.settings = {
            'language_id' : '1000',
            'location_id' : '2826',
            'network' : {
                'targetGoogleSearch' : True,
                'targetSearchNetwork' : False,
                'targetContentNetwork' : False,
                'targetPartnerSearchNetwork' : False
                }
            }

    def make_adwords_call(self, query_list, only_keyword_stats):
        """
        Returns: 
            Cleaned adwords dictionary
        
        Parameters:
            query_list: The keywords to get results back on. Needs to be passed as a string list.
            (Although one at a time is possible.)
            only_keyword_stats: Boolean on whether to only return stats on the
            keywords in the query_list.
        """
        kwargs = {
                "queryList" : query_list, 
                "only_keyword_stats" : only_keyword_stats,
                "language_id" : self.settings['language_id'],
                'location_id' : self.settings['location_id'],
                'network' : self.settings['network']
                }
                
        return connections.make_connection_attempt(function = api_caller.keyword_suggestion_stats, kwarg_dictionary = kwargs, error_dict = adwords_errors)

    def update_settings(self, new_settings):
        """
        Updates self.settings using a dictionary

        Parameters:
            new_settings: Dictionary that is of the same format as settings.
        """
        for key, value in new_settings.items():
            if key in self.settings and value != None:
                self.settings[key] = value

    def get_keyword_stats(self, keyword_list):
        """Batches keywords into lists of 500 and retrieves the statistics on them"""
        batch_size = 500
        n = 0
        keywords = {}

        if len(keyword_list) < batch_size:
            batch_size = len(keyword_list)

        while n < len(keyword_list):
            split_list = keyword_list[n : n + batch_size]

            keywords = {**keywords, **self.make_adwords_call(query_list = split_list, only_keyword_stats = True)}

            n += batch_size

        return keywords

    def get_keyword_suggestions(self, keyword_list):
        """Places in one keyword at a time and then returns the total dictionary"""
        total_keywords = {}

        for keyword in keyword_list:
            keywords = self.make_adwords_call(query_list = [keyword], only_keyword_stats = False)

            for key in keywords:
                if key in total_keywords:
                    keywords[key]["Parent Keyword"] += total_keywords[key]["Parent Keyword"]

            total_keywords = {**total_keywords, **keywords}

        return total_keywords

    def keyword_caller(self, call_type, keyword_list):
        """
        Returns:
            A cleaned adwords dictionary.

        Parameters:
            call_type: String. Either 'stats' or 'suggestions'
            depending on which endpoint to call.
            keyword_list: String list. The list of keywords to
            push through adwords. Is lowered beforehand for consistency.
        """
        keywords = []

        for keyword in keyword_list:
            keywords.append(keyword.lower())

        if call_type == 'statistics':
            keyword_dict = self.get_keyword_stats(keyword_list = keywords)

        elif call_type == 'suggestions':
            keyword_dict = self.get_keyword_suggestions(keyword_list = keywords)

        else:
            raise ValueError("call_type must be either 'stats' or 'suggestions'")

        return keyword_organiser.organised_dictionary(adwords_dictionary = keyword_dict)