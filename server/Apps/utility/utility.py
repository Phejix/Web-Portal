from operator import itemgetter

def list_to_string(arrayList, separate_token = None, repair_token = " ", join_token = '', ignore_blanks = False):
    """
    Returns a single string concatenated with all the values of the arrayList.

    Parameters:

    arrayList: A list of ints or strings (MUST BE STRING CONVERTABLE).
    separate_token: Character. Splits the individual strings by a character if applicable.
    repair_token: Character. Joins the split string back together
    join_token: Character. Dictates how to join the string together in the final output.
    ignore_blanks: Boolean. Used when splitting the string to ignore blank values after splitting.
    """
    final_string = ""
    initial_pass = True

    for item in arrayList:
        string_item = str(item)

        if separate_token != None:
            split = string_item.split(separate_token)
            first_pass = True

            for i in split:
                if i == '' and ignore_blanks:
                    continue

                if first_pass:
                    string_item = i
                    first_pass = False

                else:
                    string_item = string_item + repair_token + i

        if initial_pass:
            final_string = string_item
            initial_pass = False
        else:
            final_string = final_string + join_token + string_item

    return final_string

def remove_key(dictionary, key):
    temp = dict(dictionary)
    del temp[key]
    return temp

def reorder_dictionary(new_keys_order, unordered_dictionary):
    reordered = {}

    for key in new_keys_order:
        reordered[key] = unordered_dictionary[key]

    for remaining_key in unordered_dictionary:
        if remaining_key not in new_keys_order:
            reordered[remaining_key] = unordered_dictionary[remaining_key]

    return reordered

def uniquify_list(item_list):
    """Fastest current way to return a unique list"""
    return list(dict.fromkeys(item_list))

def uniquify_dict_list(dict_list):
    unique_list = []
    for dictionary in dict_list:
        if dictionary not in unique_list:
            unique_list.append(dictionary)

    return unique_list

def lower_list(item_list):
    lowered_list = []

    for item in item_list:
        lowered_list.append(item.lower())

    return lowered_list

def get_ordered_dictionary_list(dictionary_list, item_key, reverse = False, max_amount = None):
    if max_amount:
        end_chunk = max_amount
    else:
        end_chunk = len(dictionary_list)

    return sorted(dictionary_list, key = itemgetter(item_key), reverse = reverse)[0 : end_chunk]