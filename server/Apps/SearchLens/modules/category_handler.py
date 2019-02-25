from ...utility import utility

import os
import json

class CategoryHandler(object):

    def __init__(self, google_taxonomy_json = os.path.join(os.getcwd(), "server", "Apps", "SearchLens", "modules", "google_taxonomy.json")):
        self.google_taxonomy = self.open_google_taxonomy(google_taxonomy_json = google_taxonomy_json)

    def open_google_taxonomy(self, google_taxonomy_json):
        with open(google_taxonomy_json) as file:
            return json.load(file)

    def categorise_adwords(self, adwords_dictionary):
        """
        Returns:
            A dictionary of adwords keywords with the categorisation
            completed.

        Parameters:
            adwords_dictionary: The dictionary that holds the categoriess
        """
        for key in adwords_dictionary:
            adwords_dictionary[key]["Google Categories"] = utility.uniquify_list(
                                                                item_list = self.sort_google_categories(
                                                                    category_id_list = adwords_dictionary[key]["Google Categories"]
                                                                )
                                                            )

        return adwords_dictionary

    def sort_google_categories(self, category_id_list):
        """
        Returns:
            A list of unique strings that are converted
            from the Google category ID.

        Parameters:
            category_id_list: A list of ints representing 
            Google's category.
        """
        category_list = []

        for category_id in category_id_list:
            categories = self.get_category_list(str(category_id))

            for category in categories:
                if category not in category_list:
                    category_list.append(category)

        return category_list

    def get_category_list(self, category_id):
        """If code isn't in the taxonomy then 0 is returned"""
        try:
            return self.google_taxonomy[category_id]
        except KeyError:
            return ""