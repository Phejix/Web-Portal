import ssl
import googleads
import google
import requests

adwords_errors = {
    #oauth2client.client.HttpAccessTokenRefreshError : 5,
    ssl.SSLError : 1,
    googleads.errors.GoogleAdsServerFault : 35,
    google.auth.exceptions.TransportError : 1,
    requests.exceptions.SSLError : 1
}