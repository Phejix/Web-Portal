from .adwords import interface
from . import category_handler

import os
import json

categoriser = category_handler.CategoryHandler()
ad_interface = interface.AdwordsInterface()

with open(os.path.join(os.getcwd(), "server", "Apps", "SearchLens", "modules", "google_locations.json")) as file:
    google_locations = json.load(file)

with open(os.path.join(os.getcwd(), "server", "Apps", "SearchLens", "modules", "google_languages.json")) as file:
    google_languages = json.load(file)

def get_adwords_results(keyword_list, call_type, location_id = None, language_id = None, network = None):
    """
    Calls the Adwords API and gets stats/suggestions for a keyword list. Categorises them and then outputs it to the chosen location.

    Parameters:
        keyword_list: A list of strings representing the keywords to call.
        call_type: String either 'statistics' or 'suggestions'
        location_id: String/Int for the specific location_id from Google's id list.
        language_id: String/Int for a language_id from Google's list.
        network: Dictionary. See adwords_interface.py for details on format.
    """
    new_settings = create_new_settings(location_id = location_id, language_id = language_id, network = network)
    if new_settings:
        ad_interface.update_settings(new_settings = {'location_id' : str(location_id), 'language_id' : str(language_id), 'network' : network})

    keyword_dictionary = ad_interface.keyword_caller(call_type = call_type, keyword_list = keyword_list)
    keyword_dictionary = categoriser.categorise_adwords(adwords_dictionary = keyword_dictionary)

    return convert_keyword_dictionary(keyword_dictionary = keyword_dictionary)

def create_new_settings(location_id = None, language_id = None, network = None):
    new_settings = {}

    if location_id:
        new_settings['location_id'] = location_id

    if language_id:
        new_settings['language_id'] = language_id

    if network:
        new_settings['network'] = network

    return new_settings

def get_locations():
    location_list = []

    for location_id in google_locations:
        if google_locations[location_id]["Target Type"] == "Country":
            location_list.append({
                "ID" : location_id,
                "Name" : google_locations[location_id]["Name"]
            })

    return location_list

def get_languages():
    language_list = []

    for language_id in google_languages:
        language_list.append({
            "ID" : language_id,
            "Name" : google_languages[language_id]["Name"]
        })

    return language_list

def convert_keyword_dictionary(keyword_dictionary):
    """
    Converts the keyword dictionary to an ordered dictionary list due
    to the json transition causing the request order to be lost
    """
    keyword_dictionary_list = []

    for keyword, keyword_stats in keyword_dictionary.items():
        key_dict = {"Keywords" : keyword}

        for stat in keyword_stats:
            key_dict[stat] = keyword_stats[stat]

        keyword_dictionary_list.append(key_dict)

    return keyword_dictionary_list