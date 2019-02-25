import csv
import codecs

def write_dictionary_list(dictionary_list, file_path, encoding = 'utf-8-sig', appending = False):
    """Writes a csv of a dictionary list to the chosen file path"""
    if not appending:
        style = "w"
    else:
        style = "a"

    with codecs.open(file_path, style, encoding = encoding) as csv_file:
        write_list(csv_file = csv_file, dictionary_list = dictionary_list, appending = appending)

def write_list(csv_file, dictionary_list, appending = False):
    fieldnames = find_all_fieldnames(dictionary_list)
    writer = csv.DictWriter(csv_file, fieldnames = fieldnames, delimiter = ",")

    if not appending:
        writer.writeheader()

    for diction in dictionary_list:
        writer.writerow(diction)

def nested_dictionary_to_dict_list(nested_dictionary, key_reference):
    """
    Returns:
        A list of Converted dictionaries from the format {Item : {Stats about item}}. Done by
    transforming the large dictionary into a list of dictionaries per Item.

    Parameters:
        nested_dictionary: Item dictionary as defined above.
        key_reference: What to name the Item in the new dictionary (also the column name in the csv)
    """
    dict_list = []

    for key, value in nested_dictionary.items():
        new_dict = {}

        if type(value) != dict:
            raise ValueError("Dictionary must be nested")

        new_dict[key_reference] = key
        new_dict = {**new_dict, **value}
        dict_list.append(new_dict)

    return dict_list

def find_all_fieldnames(dictionary_list):
    """Makes sure all possible column headers are included"""
    fieldnames = []

    for dictionary in dictionary_list:
        for key in dictionary:
            if key not in fieldnames:
                fieldnames.append(key)

    return fieldnames