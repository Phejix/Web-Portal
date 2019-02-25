from .Ship import Ship

import os
import random
import uuid

class Port(object):
    """
    Creates and holds ships.

    Referred to by the DockMaster module to check and alter the status of Ships.

    Attributes:
        ship_count: Int. Number of ships to spawn.
        docked_ships: Ship ID List. Ship ID String that are available to send out.
        sailing_ships: Ship ID List. Ship ID String that are already working.
        created_ships: Ship Dict. A dictionary of {"Ship ID" : Ship}
    """

    def __init__(self, ship_count, processing_type = 'thread'):
        self.ship_count = ship_count
        self.processing_type = processing_type
        self.docked_ships = []
        self.sailing_ships = []
        self.created_ships = {}

        for i in range(ship_count):
            self.create_ship(ship_id = self.create_ship_id())

    def dock_ship(self, ship_id):
        self.docked_ships.append(ship_id)
        self.sailing_ships.remove(ship_id)

    def set_sailing(self, ship_id):
        self.sailing_ships.append(ship_id)
        self.docked_ships.remove(ship_id)

    def alter_port_status(self, ship_id):
        """Swaps a ship id between docked and sailing list"""
        if ship_id in self.docked_ships:
            self.set_sailing(ship_id)

        elif ship_id in self.sailing_ships:
            self.dock_ship(ship_id)

        else:
            raise ValueError("Unknown Ship ID")

    def create_ship(self, ship_id):
        self.created_ships[ship_id] = Ship(ship_id = ship_id, processing_type = self.processing_type)
        self.docked_ships.append(ship_id)

    def get_ship(self, ship_id):
        """Returns the actual Ship object based on an id"""
        if ship_id in self.created_ships:
            return self.created_ships[ship_id]
        else:
            raise ValueError("Unknown Ship ID")

    def get_docked_ship_ids(self):
        return self.docked_ships

    def get_sailing_ship_ids(self):
        return self.sailing_ships

    def get_all_ship_ids(self):
        return list(self.created_ships)

    def create_ship_id(self):
        return uuid.uuid4().hex