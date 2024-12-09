import sqlite3

def get_db():
    conn = sqlite3.connect("./db/keiretsu.db")
    conn.row_factory = sqlite3.Row #sqlite3.Row is a dictionary-like object that allows you to access the columns by name.
    return conn 
