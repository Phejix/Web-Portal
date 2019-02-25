from googleads import adwords
import os

#Requires a .yaml file from the adwords developers section before it will work 
yaml_loc = os.path.join(os.getcwd(), "server", "Apps", "SearchLens", "modules", "googleads.yaml")

PAGE_SIZE = 500
attributeList = ['KEYWORD_TEXT', 'SEARCH_VOLUME', 'CATEGORY_PRODUCTS_AND_SERVICES', 'COMPETITION', 'AVERAGE_CPC', 'TARGETED_MONTHLY_SEARCHES']

def build_selector(ideaType, requestType, queryList, attributeList = attributeList, offset = 0, PAGE_SIZE = PAGE_SIZE,
  network = None, language_id = None, location_id = None, ad_group_id = None):
    """
    Returns a selector used by the TargetingIdeaService to get keywords related to query.

    Parameters:

    ideaType: String. 
    requestType: String.
    attributeList: String List.
    queryList: String list of the words used to get suggestions from.
    offset: Int.
    PAGE_SIZE: Int. How many results to pull down at once.
    network (optional setting): Dictionary. Should be filled out in this example format:

                  'targetGoogleSearch' : True,
                  'targetSearchNetwork' : False,
                  'targetContentNetwork' : False,
                  'targetPartnerSearchNetwork' : False

    language_id (optional setting): String. IDs can be found in google documentation here https://developers.google.com/adwords/api/docs/appendix/languagecodes.
    ad_group_id (optional setting): String. Used to set SearchAdGroupID parameter.

    """
    selector = {
        'ideaType' : ideaType,
        'requestType' : requestType
    }

    selector['requestedAttributeTypes'] = attributeList

    selector['paging'] ={
        'startIndex' : str(offset),
        'numberResults' : str(PAGE_SIZE)
    }

    selector['searchParameters'] = [{
        'xsi_type' : 'RelatedToQuerySearchParameter', #This could be changed to allow a more abstract method
        'queries' : queryList
    }]

    if network:
        selector['searchParameters'].append({
            'xsi_type' : 'NetworkSearchParameter',
            'networkSetting' : network
        })

    if language_id:
        selector['searchParameters'].append({
            'xsi_type' : 'LanguageSearchParameter',
            'languages' : [{'id' : language_id}] #TODO: Update to reflect that multiple languages can be taken
        })

    if ad_group_id:
        selector['searchParameters'].append({
            'xsi_type' : 'SeedAdGroupIdSearchParameter',
            'adGroupId' : ad_group_id
            })

    if location_id:
        selector['searchParameters'].append({
            'xsi_type' : 'LocationSearchParameter',
            'locations' : [{'id' : location_id}]
            })

    return selector

def get_keyword_data(selector, targeting_service, offset = 0, PAGE_SIZE = PAGE_SIZE, exclusion_list = [], parent_keyword = None):
    """
    Returns a dictionary of the format Keyword : Category Int, Search Volume, Competition, Average cost per click, Monthly Searches, Parent Keyword

    Parameters:

    selector: A selector dictionary. Available from build_selector.
    targeting_service: An adwords client method. (client.GetService('TargetingIdeaService'))
    offset: Int. Used for paging.
    PAGE_SIZE: Int. How many results are pulled back at once.
    """
    more_pages = True
    keyword_data = {}

    while more_pages:
        page = targeting_service.get(selector)

        if 'entries' in page:
            for result in page['entries']:
                attributes = {}
                for trait in result['data']:
                    attributes[trait['key']] = getattr(trait['value'], 'value', '0')

                if attributes['KEYWORD_TEXT'] not in exclusion_list:
                    keyword_data[attributes['KEYWORD_TEXT']] = {"Category" : attributes['CATEGORY_PRODUCTS_AND_SERVICES'],"Search Volume" : attributes['SEARCH_VOLUME'],
                    "Competition" : attributes['COMPETITION'], "CPC" : attributes['AVERAGE_CPC'], "Monthly Searches" : attributes['TARGETED_MONTHLY_SEARCHES']}

                    if parent_keyword:
                        keyword_data[attributes['KEYWORD_TEXT']]['Parent Keyword'] = [str(parent_keyword)]
                    else:
                        keyword_data[attributes['KEYWORD_TEXT']]['Parent Keyword'] = [str(attributes['KEYWORD_TEXT'])]

        offset += PAGE_SIZE
        selector['paging']['startIndex'] = str(offset)
        more_pages = offset < int(page['totalNumEntries'])

    return keyword_data

def keyword_suggestion_stats(queryList, network = None, language_id = None, location_id = None, ad_group_id = None, only_keyword_stats = False, exclusion_list = []):
    """
    Initialises the adwords api client and returns a dictionary of keyword suggestions and their statistics.
    The stats_selector part is used to append the statistics of the keywords that the user inputs.

    Parameters:

    queryList: String List. A list of keywords to query.
    network (optional setting): Dictionary. Should be filled out in this example format:

                  'targetGoogleSearch' : True,
                  'targetSearchNetwork' : False,
                  'targetContentNetwork' : False,
                  'targetPartnerSearchNetwork' : False

    language_id (optional setting): String. IDs can be found in google documentation here https://developers.google.com/adwords/api/docs/appendix/languagecodes.
    ad_group_id (optional setting): String. Used to set SearchAdGroupID parameter.
    keyword_suggestions
    """

    #-------------------------INVESTIGATE WHETHER THIS CAN BE CHANGED TO GENERATE CREDENTIALS BASED ON A USER LOGGING IN---------------------------#
    adwords_client = adwords.AdWordsClient.LoadFromStorage(yaml_loc)

    targeting_idea_service = adwords_client.GetService('TargetingIdeaService', version='v201809')
    stats_selector = build_selector(ideaType = 'KEYWORD', requestType = 'STATS', queryList = queryList, network = network, language_id = language_id, location_id = location_id)

    stats = get_keyword_data(selector = stats_selector, targeting_service = targeting_idea_service, exclusion_list = exclusion_list)

    if not only_keyword_stats:
        suggestion_selector = build_selector(ideaType = 'KEYWORD', requestType = 'IDEAS', queryList = queryList, network = network, language_id = language_id, location_id = location_id)
        suggestions = get_keyword_data(selector = suggestion_selector, targeting_service = targeting_idea_service, exclusion_list = exclusion_list, parent_keyword = queryList[0])
        keywords = {**stats, **suggestions}

    else:
        keywords = stats

    return keywords