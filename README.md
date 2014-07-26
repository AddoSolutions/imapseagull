imapseagull
===========

# IMAP Server, NodeJS

Supported all commands of IMAP4rev1, but might be a bit buggy.

Based on https://github.com/andris9/hoodiecrow with multiusers support, MongoDB integration, MailParser (https://github.com/andris9/mailparser), MailComposer (https://github.com/andris9/mailcomposer), but has some rudiments.

# Usage example

First of all, install needed packages:

```npm install imapseagull imapseagull-storage-mongo```

Later we can write some code to initialize example IMAP Server:

```node
var IMAPServer = require('imapseagull'),
    AppStorage = require('imapseagull-storage-mongo'),
    fs = require('fs'),
    path = require('path');

var NAME = 'test.com';

new AppStorage({
    name: NAME,
    debug: true,

    // directory to keep attachments from emails
    attachments_path: path.join(__dirname, './'),

    // connection string for mongo
    connection: 'mongodb://localhost:27017/test.com?auto_reconnect',

    // collections names
    messages: 'emails',
    users: 'users'
}, function(err, storage) {

    storage.init(); // function 'init' specified into AppStorage to provide availability to redefine it

    var imapServer = IMAPServer({
        debug: true,
        plugins: ['ID', 'STARTTLS', 'AUTH-PLAIN', 'SPECIAL-USE', 'NAMESPACE', 'IDLE', /*'LOGINDISABLED',*/ 'SASL-IR', 'ENABLE', 'LITERALPLUS', 'UNSELECT', 'CONDSTORE'],
        id: {
            name: NAME,
            version: '1'
        },
        credentials: {
            key: fs.readFileSync(path.join(__dirname, './node_modules/imapseagull/tests/server.crt')),
            cert: fs.readFileSync(path.join(__dirname, './node_modules/imapseagull/tests/server.key'))
        },
        secureConnection: false,
        storage: storage,
        folders: {
            'INBOX': {
                'special-use': '\\Inbox',
                type: 'personal'
            },
            '': {
                folders: {
                    'Drafts': {
                        'special-use': '\\Drafts',
                        type: 'personal'
                    },
                    'Sent': {
                        'special-use': '\\Sent',
                        type: 'personal'
                    },
                    'Junk': {
                        'special-use': '\\Junk',
                        type: 'personal'
                    },
                    'Trash': {
                        'special-use': '\\Trash',
                        type: 'personal'
                    }
                }
            }
        }
    });

    imapServer.on('close', function() {
        console.log('IMAP server %s closed', NAME);
    });

    imapServer.listen(143, function() {
        console.log('IMAP server %s started', NAME);
    });

});
```

