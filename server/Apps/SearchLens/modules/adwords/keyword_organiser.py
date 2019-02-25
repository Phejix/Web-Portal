
def organised_dictionary(adwords_dictionary):
    """
    Converts raw adwords data into a more organised dictionary

    Returns:
        Nested Dictionary.

    Parameters:
        adwords_dictionary: Dictionary of raw adwords data. (See adwords_functions)
    """
    organised_dictionary = {}

    for key in adwords_dictionary:
        organised_dictionary[str(key)] = create_stats_dict(keyword_dictionary = adwords_dictionary[key])

    return organised_dictionary

def convert_cpc(cpc_value):
    """
    Returns:
        0 if no cost per click data available or returns the converted amount from Google's custom currency.

    Parameters:
        cpc_value: Int if 0 else a Google Money class. The cost per click value in Google's currency.
    """
    conversion_amount = 1/1000000 #The amount to convert from Google's micro amount to local currency. At time of implementation 1 GBP = 1 million microAmount

    if cpc_value == str(0):
        return cpc_value
    else:
        return cpc_value.microAmount * conversion_amount

def sort_monthly_searches(keyword_dictionary, monthly_searches):
    """
    Void method which adds a key for each of the monthly searches
    into the organised_dictionary.

    Parameters:
        keyword_dictionary: The dictionary to add the keys to
        monthly_searches: A dictionary contained each of the monthly searches (from raw adwords data)
    """
    for month in monthly_searches:
        name = str(month.month) + "/" + str(month.year)

        try:
            month_count = month.count

        except AttributeError as e:
            month_count = 0

        keyword_dictionary[name] = month_count

def create_stats_dict(keyword_dictionary):
    """
    Returns:
        Dictionary of statistics for designated keyword

    Parameters:
        keyword_dictionary: Holds the keys to organise
    """
    stats_dict = {}

    if keyword_dictionary["CPC"] == None:
        keyword_dictionary["CPC"] = str(0)

    stats_dict["Google Categories"] = keyword_dictionary["Category"]
    stats_dict["Search Volume"] = keyword_dictionary["Search Volume"]
    stats_dict["Competition"] = keyword_dictionary["Competition"]
    stats_dict["CPC"] = convert_cpc(cpc_value = keyword_dictionary["CPC"])
    stats_dict["Parent Keyword"] = keyword_dictionary["Parent Keyword"]

    sort_monthly_searches(keyword_dictionary = stats_dict, monthly_searches = keyword_dictionary["Monthly Searches"])

    return stats_dict