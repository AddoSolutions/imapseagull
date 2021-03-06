
var app_tests = require("../app_tests");
var mockClient = require("../mock-client");

module.exports["Special-use"] = {
    setUp: app_tests.createSetUp(),
    tearDown: app_tests.tearDown,

    "LIST NORMAL": function(test){
        var cmds = ["A1 LOGIN testuser testpass",
                "A2 CAPABILITY",
                "A3 LIST \"\" \"*\"",
                "ZZ LOGOUT"];

        mockClient(app_tests.port, "localhost", cmds, false, (function(err, resp){
            resp = resp.toString();
            test.equal((resp.match(/^\* LIST\b/mg) || []).length, 5);
            test.ok(resp.indexOf('\n* LIST (\\HasNoChildren \\Inbox) NIL "INBOX"\r\n') >= 0);
            test.ok(resp.indexOf('\n* LIST (\\HasNoChildren \\Drafts) "/" "Drafts"\r\n') >= 0);
            test.ok(resp.indexOf('\n* LIST (\\HasNoChildren \\Sent) "/" "Sent"\r\n') >= 0);
            test.ok(resp.indexOf('\n* LIST (\\HasNoChildren \\Junk) "/" "Junk"\r\n') >= 0);
            test.ok(resp.indexOf('\n* LIST (\\HasNoChildren \\Trash) "/" "Trash"\r\n') >= 0);
            test.ok(resp.indexOf("\nA3 OK") >= 0);
            test.done();
        }).bind(this));
    },

    "LIST (SPECIAL-USE)": function(test){
        var cmds = ["A1 LOGIN testuser testpass",
                "A2 CAPABILITY",
                "A3 LIST (SPECIAL-USE) \"\" \"*\"",
                "ZZ LOGOUT"];

        mockClient(app_tests.port, "localhost", cmds, false, (function(err, resp){
            resp = resp.toString();
            test.equal((resp.match(/^\* LIST\b/mg) || []).length, 1);
            test.ok(resp.indexOf('\n* LIST (\\HasNoChildren \\Sent) "/" "Sent"\r\n') >= 0);
            test.ok(resp.indexOf("\nA3 OK") >= 0);
            test.done();
        }).bind(this));
    },

    // TODO: Need another folder structure to test => separate and change throw app_tests.createSetUp
    "LIST RETURN (SPECIAL-USE)": function(test){
        var cmds = ["A1 LOGIN testuser testpass",
                "A2 CAPABILITY",
                "A3 LIST \"\" \"*\" RETURN (SPECIAL-USE)",
                "ZZ LOGOUT"];

        mockClient(app_tests.port, "localhost", cmds, false, (function(err, resp){
            resp = resp.toString();
            test.equal((resp.match(/^\* LIST\b/mg) || []).length, 3);
            test.ok(resp.indexOf('\n* LIST () "/" "INBOX"\r\n') >= 0);
            test.ok(resp.indexOf('\n* LIST () "/" "Test"\r\n') >= 0);
            test.ok(resp.indexOf('\n* LIST (\\Sent \\Drafts) "/" "Sent mail"\r\n') >= 0);
            test.ok(resp.indexOf("\nA3 OK") >= 0);
            test.done();
        }).bind(this));
    },

    "LIST (SPECIAL-USE) RETURN (SPECIAL-USE)": function(test){
        var cmds = ["A1 LOGIN testuser testpass",
                "A2 CAPABILITY",
                "A3 LIST (SPECIAL-USE) \"\" \"*\" RETURN (SPECIAL-USE)",
                "ZZ LOGOUT"];

        mockClient(app_tests.port, "localhost", cmds, false, (function(err, resp){
            resp = resp.toString();
            test.equal((resp.match(/^\* LIST\b/mg) || []).length, 5);
            test.ok(resp.indexOf('\n* LIST (\\Sent) "/" "Sent"\r\n') >= 0);
            test.ok(resp.indexOf("\nA3 OK") >= 0);
            test.done();
        }).bind(this));
    }
};
