const express = require('express')
const mysql   = require('mysql')
const conf    = require('../config.js')

var pool = mysql.createPool(conf.db_conn)

exports.connection = {
    query: function () {
        var queryArgs = Array.prototype.slice.call(arguments),
            events = [],
            eventNameIndex = {}

        pool.getConnection(function (err, conn) {
            if (err) {
                if (eventNameIndex.error) {
                    eventNameIndex.error()
                }
            }
            if (conn) { 
                var q = conn.query.apply(conn, queryArgs)
                q.on('end', function () {
                    conn.release()
                })

                events.forEach(function (args) {
                    q.on.apply(q, args)
                })
            }
        })

        return {
            on: function (eventName, callback) {
                events.push(Array.prototype.slice.call(arguments))
                eventNameIndex[eventName] = callback
                return this
            }
        }
    }
}