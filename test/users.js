var rest = require('restler');
var assert = require('assert');
var database = require('./../modules/database');
var jwt = require('jsonwebtoken');
var helper = require('../modules/helper.js');

var base_url = 'http://localhost:3000/api/v1/users';

suite('Users', function() {
    this.beforeEach(function (done) {
        // Because of foreign key constraints I can't just truncate :(
        database.dropTables(function() {
            database.createTables(done);
        });
    });


    test('Able to load user list without users', function(done) {
        rest.get(base_url + '/').on('complete', function(data) {
            assert.equal(data.statusCode, 200);
            done();
        });
    });

    test('Able to load user list with users', function(done) {
        rest.post(base_url + '/', {
            data: {
                email: "fake@gmail.com",
                firstName: "Fake",
                lastName: "Name",
                password: "badPassword#1"
            }
        }).on('complete', function(data) {
            rest.post(base_url + '/', {
                data: {
                    email: "fake2@gmail.com",
                    firstName: "Fake",
                    lastName: "Name",
                    password: "badPassword#2",
                    bio: "Hello!"
                }
            }).on('complete', function(data) {
                rest.get(base_url + '/').on('complete', function(data) {
                    var expected = [
                    {
                        id: 1,
                        email: "fake@gmail.com",
                        firstName: "Fake",
                        lastName: "Name",
                        bio: null
                    },{
                        id: 2,
                        email: "fake2@gmail.com",
                        firstName: "Fake",
                        lastName: "Name",
                        bio: "Hello!"
                    }
                    ];
                    assert.deepEqual(data.users, expected);
                    done();
                });
            });
        });
    });

    test('Able to load user list with users with offset and limit', function(done) {
        rest.post(base_url + '/', {
            data: {
                email: "fake@gmail.com",
                firstName: "Fake",
                lastName: "Name",
                password: "badPassword#1"
            }
        }).on('complete', function(data) {
            rest.post(base_url + '/', {
                data: {
                    email: "fake2@gmail.com",
                    firstName: "Fake",
                    lastName: "Name",
                    password: "badPassword#2",
                    bio: "Hello!"
                }
            }).on('complete', function(data) {
                rest.get(base_url + '/', { query: { limit: 1, offset: 1 }}).on('complete', function(data) {
                    var expected = [
                    {
                        id: 2,
                        email: "fake2@gmail.com",
                        firstName: "Fake",
                        lastName: "Name",
                        bio: "Hello!"
                    }
                    ];
                    assert.deepEqual(data.users, expected);
                    done();
                });
            });
        });
    });

    test('Able to create user without bio', function(done) {
        rest.post(base_url + '/', {
            data: {
                email: "fake@gmail.com",
                firstName: "Fake",
                lastName: "Name",
                password: "badPassword#1",
            }
        }).on('complete', function(data) {
            assert.equal(data.statusCode, 200);
            done();
        });
    });

    test('Able to create user with bio', function(done) {
        rest.post(base_url + '/', {
            data: {
                email: "fake@gmail.com",
                firstName: "Fake",
                lastName: "Name",
                password: "badPassword#1",
                bio: "Hello world :)"
            }
        }).on('complete', function(data) {
            assert.equal(data.statusCode, 200);
            done();
        });

    });

    test('Not able to add duplicate user', function(done) {
        rest.post(base_url + '/', {
            data: {
                email: "fake@gmail.com",
                firstName: "Fake",
                lastName: "Name",
                password: "badPassword#1",
            }
        }).on('complete', function(data) {
            rest.post(base_url + '/', {
                data: {
                    email: "fake@gmail.com",
                    firstName: "Fake",
                    lastName: "Name",
                    password: "badPassword#1",
                }
            }).on('complete', function(data) {
                assert.equal(data.statusCode, 400);
                done();
            });
        });
    });

    test('Fail if invalid email during user creation', function(done) {
        var badEmails = [ "", "fakeemail", "fake@fake", "fake.com", "@", ".@." ];

        var counter = 0;
        badEmails.forEach(function(email) {
            rest.post(base_url + '/', {
                data: {
                    email: email,
                    firstName: "Fake",
                    lastName: "Name",
                    password: "badPassword#1",
                }
            }).on('complete', function(data) {
                assert.equal(data.statusCode, 400);
                counter++;
                if (counter+1 == badEmails.length) done();
            });
        });
    });

    test('User listing should never reveal paswords', function(done) {
        rest.post(base_url + '/', {
            data: {
                email: "fake@gmail.com",
                firstName: "Fake",
                lastName: "Name",
                password: "badPassword#1"
            }
        }).on('complete', function(data) {
            rest.post(base_url + '/', {
                data: {
                    email: "fake2@gmail.com",
                    firstName: "Fake",
                    lastName: "Name",
                    password: "badPassword#2"
                }
            }).on('complete', function(data) {
                rest.get(base_url + '/').on('complete', function(data) {
                    data.users.forEach(function(user) {
                        assert.equal(user.password, undefined);
                    });
                    done();
                });
            });
        });
    });

    test('Specific user response should never reveal password', function(done) {
        rest.post(base_url + '/', {
            data: {
                email: "fake@gmail.com",
                firstName: "Fake",
                lastName: "Name",
                password: "badPassword#1"
            }
        }).on('complete', function(data) {
            rest.get(base_url + '/1').on('complete', function(data) {
                assert.equal(data.user.password, undefined);
                done();
            });
        });
    });

    test('Specific user request with a non-integer ID must fail', function(done) {
        rest.get(base_url + '/a').on('complete', function(data) {
            assert.equal(data.statusCode, 404);
            done();
        });
    });

    test('Specific user request for a non-existant user must fail', function(done) {
        rest.get(base_url + '/1').on('complete', function(data) {
            assert.equal(data.statusCode, 404);
            done();
        });
    });

    test('Can login', function(done) {
        rest.post(base_url + '/', {
            data: {
                email: "fake@gmail.com",
                firstName: "Fake",
                lastName: "Name",
                password: "badPassword#1"
            }
        }).on('complete', function(data) {
            rest.post(base_url + '/authenticate', {
                data: {
                    email: 'fake@gmail.com',
                    password: 'badPassword#1'
                }
            }).on("complete", function (data) {
                token = data.token;
                jwt.verify(token, helper.getSecret(), function (err, decoded) {
                    assert.equal(decoded.userID, 1);
                });
                assert.equal(data.statusCode, 200);
                done();
            });
        });
    });

    test('Login with no data should fail', function(done) {
        rest.post(base_url + '/authenticate').on('complete', function(data) {
            assert.equal(data.statusCode, 400);
            done();
        });
    });

    test('Invalid credentials should fail', function(done) {
        rest.post(base_url + '/authenticate', {
            data: {
                email: 'billnye@mail.com',
                password: 'thescienceguy'
            }
        }).on('complete', function(data) {
            assert.equal(data.statusCode, 400);
            done();
        });
    });

    test('Delete without id is not a valid route', function(done) {
        rest.post(base_url + '/', {
            data: {
                email: "fake@gmail.com",
                firstName: "Fake",
                lastName: "Name",
                password: "badPassword#1"
            }
        }).on('complete', function(data) {
            rest.post(base_url + '/authenticate', {
                data: {
                    email: 'fake@gmail.com',
                    password: 'badPassword#1'
                }
            }).on('complete', function(data) {
                rest.del(base_url + '/', { data: { token: data.token }}).on('complete', function(data) {
                            assert.equal(data.statusCode, 404);
                            done();
                });
            });
        });
    });

    test('Cannot delete non-existant user', function(done) {
        rest.post(base_url + '/', {
            data: {
                email: "fake@gmail.com",
                firstName: "Fake",
                lastName: "Name",
                password: "badPassword#1"
            }
        }).on('complete', function(data) {
            rest.post(base_url + '/authenticate', {
                data: {
                    email: 'fake@gmail.com',
                    password: 'badPassword#1'
                }
            }).on('complete', function(data) {
                rest.del(base_url + '/2', { data: { token: data.token }}).on('complete', function(data) {
                            assert.equal(data.statusCode, 404);
                            done();
                });
            });
        });
    });

    test('Cannot delete user with non-numerical id', function(done) {
        rest.post(base_url + '/', {
            data: {
                email: "fake@gmail.com",
                firstName: "Fake",
                lastName: "Name",
                password: "badPassword#1"
            }
        }).on('complete', function(data) {
            rest.post(base_url + '/authenticate', {
                data: {
                    email: 'fake@gmail.com',
                    password: 'badPassword#1'
                }
            }).on('complete', function(data) {
                rest.del(base_url + '/a', { data: { token: data.token }}).on('complete', function(data) {
                        assert.equal(data.statusCode, 404);
                        done();
                });
            });
        });

    });

    test('Cannot delete existant user if not logged in', function(done) {
        rest.post(base_url + '/', {
            data: {
                email: "fake@gmail.com",
                firstName: "Fake",
                lastName: "Name",
                password: "badPassword#1"
            }
        }).on('complete', function(data) {
            rest.del(base_url + '/1').on('complete', function(data) {
                assert.equal(data.statusCode, 403);
                done();
            });
        });
    });

    test('Cannot delete another person\'s account', function(done) {
         rest.post(base_url + '/', {
                data: {
                    email: "fake@gmail.com",
                    firstName: "Fake",
                    lastName: "Name",
                    password: "badPassword#1"
                }
            }).on('complete', function(data) {
                rest.post(base_url + '/', {
                    data: {
                        email: "fake2@gmail.com",
                        firstName: "Fake",
                        lastName: "Name",
                        password: "badPassword#2"
                    }
                }).on('complete', function(data) {
                    rest.post(base_url + '/authenticate', {
                        data: {
                            email: 'fake@gmail.com',
                            password: 'badPassword#1'
                        }
                }).on("complete", function (data) {
                     rest.del(base_url + '/2', { data: { token: data.token } }).on('complete', function(data) {
                                    assert.equal(data.statusCode, 403);
                                    done();
                            });
                     });
                });
         });
    });

    test('Can delete your own account', function(done) {
        rest.post(base_url + '/', {
            data: {
                email: "fake@gmail.com",
                firstName: "Fake",
                lastName: "Name",
                password: "badPassword#1"
            }
        }).on('complete', function(data) {
            rest.post(base_url + '/authenticate', {
                data: {
                    email: 'fake@gmail.com',
                    password: 'badPassword#1'
                }
            }).on('complete', function(data) {
                rest.del(base_url + '/1', { data: { token: data.token }}).on('complete', function(data) {
                    assert.equal(data.statusCode, 200);
                    done();
                });
            });
        });
    });


    test('Put without id is not a valid route', function(done) {
        rest.post(base_url + '/', {
            data: {
                email: "fake@gmail.com",
                firstName: "Fake",
                lastName: "Name",
                password: "badPassword#1"
            }
        }).on('complete', function(data) {
            rest.post(base_url + '/authenticate', {
                data: {
                    email: 'fake@gmail.com',
                    password: 'badPassword#1'
                }
            }).on('complete', function(data) {
                rest.put(base_url + '/', { data: { token: data.token }}).on('complete', function(data) {
                    assert.equal(data.statusCode, 404);
                    done();
                });
            });
        });
    });

    test('Cannot update non-existant user', function(done) {
        rest.post(base_url + '/', {
            data: {
                email: "fake@gmail.com",
                firstName: "Fake",
                lastName: "Name",
                password: "badPassword#1"
            }
        }).on('complete', function(data) {
            rest.post(base_url + '/authenticate', {
                data: {
                    email: 'fake@gmail.com',
                    password: 'badPassword#1'
                }
            }).on('complete', function(data) {
                rest.put(base_url + '/2', { data: { token: data.token }}).on('complete', function(data) {
                    assert.equal(data.statusCode, 404);
                    done();
                });
            });
        });
    });

    test('Cannot update user with non-numerical id', function(done) {
        rest.put(base_url + '/a').on('complete', function(data) {
            assert.equal(data.statusCode, 404);
            done();
        });
    });

    test('Cannot update your account with wrong password', function(done) {
        rest.post(base_url + '/', {
            data: {
                email: "fake@gmail.com",
                firstName: "Fake",
                lastName: "Name",
                password: "badPassword#1"
            }
        }).on('complete', function(data) {
            rest.post(base_url + '/authenticate', {
                data: {
                    email: 'fake@gmail.com',
                    password: 'badPassword#1'
                }
            }).on('complete', function(data) {
                rest.put(base_url + '/1', {
                    data:
                    {
                        token: data.token,
                        email: "fake@gmail.com",
                        firstName: "Bob",
                        lastName: "Name",
                        password: "badPassword#1",
                        confirmPassword: "badPassword#2"
                    }
                }).on('complete', function(data) {
                    assert.equal(403, data.statusCode);
                    done();
                });
            });
        });
    });

    test('Can update your account', function(done) {
        rest.post(base_url + '/', {
            data: {
                email: "fake@gmail.com",
                firstName: "Fake",
                lastName: "Name",
                password: "badPassword#1"
            }
        }).on('complete', function(data) {
            rest.post(base_url + '/authenticate', {
                data: {
                    email: 'fake@gmail.com',
                    password: 'badPassword#1'
                }
            }).on('complete', function(data) {
                rest.put(base_url + '/1', {
                    data:
                    {
                        token: data.token,
                        email: "fake@gmail.com",
                        firstName: "Bob",
                        lastName: "Name",
                        password: "badPassword#1",
                        confirmPassword: "badPassword#1"
                    }
                }).on('complete', function(data) {
                    assert.equal(200, data.statusCode);
                    rest.get(base_url + '/1').on('complete', function(data) {
                        assert.equal("fake@gmail.com", data.user.email);
                        assert.equal("Bob", data.user.firstName);
                        assert.equal("Name", data.user.lastName);
                        done();
                    });
                });
            });
        });
    });
    test('Cannot update another person\'s account', function(done) {
         rest.post(base_url + '/', {
                data: {
                    email: "fake@gmail.com",
                    firstName: "Fake",
                    lastName: "Name",
                    password: "badPassword#1"
                }
            }).on('complete', function(data) {
                rest.post(base_url + '/', {
                    data: {
                        email: "fake2@gmail.com",
                        firstName: "Fake",
                        lastName: "Name",
                        password: "badPassword#2"
                    }
                }).on('complete', function(data) {
                    rest.post(base_url + '/authenticate', {
                        data: {
                            email: 'fake@gmail.com',
                            password: 'badPassword#1'
                        }
                }).on("complete", function (data) {
                     rest.put(base_url + '/2', { data: { token: data.token } }).on('complete', function(data) {
                                    assert.equal(data.statusCode, 403);
                                    done();
                            });
                     });
                });
         });
    });


});
