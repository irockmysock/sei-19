const sha256=require('js-sha256');
const SALT = 'SAVE FinTrack MONEY!';


module.exports = (db) => {

  /**
   * ===========================================
   * User Controllers
   * ===========================================
   */

  function hash(string) {
    let hashedString = sha256( string + SALT );
    return hashedString;
  }

  let displayHomePage = (request,response) => {
        var callback = function (error,results) {

            if (results===null){

                response.send("NO DATA")

            } else {
                if (request.params.username === results.rows[0].username && request.cookies.loggedin === hash(request.params.username)) {
                    // console.log(request.cookies)
                    console.log("REQUEST params IS")
                    console.log(request.params.username);
                    // response.send(results)
                    response.render('pages/Dashboard',results )
                    // response.redirect('/')
                    // response.redirect('/user/'+results[0].id);
                } else {
                    response.redirect('/')
                }
            }
        }
        db.users.checkLatestTxns(callback, request.params.username);
        // db.users.checkAccounts(callback, request.params.username);
    };

    let displayTransactions = (request,response) => {
        var callback = function (error,results) {

            if (results===null){

                response.send("NO DATA")

            } else {
                if (request.params.username === results.rows[0].username && request.cookies.loggedin === hash(request.params.username)) {
                    // console.log(request.cookies)
                    console.log("REQUEST params IS")
                    console.log(request.params.username);
                    response.render('pages/Transactions',results )
                    // response.redirect('/')
                    // response.redirect('/user/'+results[0].id);
                } else {
                    response.redirect('/')
                }
            }
        }
        db.users.checkAllTransactions(callback, request.params.username);
        // db.users.checkAccounts(callback, request.params.username);
    };

    let newTransaction = (request,response) => {
        let data = {
            categories: null,
            types: null,
            username: [request.params.username],
        };

        var callback = function (error,results) {
            if (results===null){
                response.send("NO DATA")
            } else {
                if (request.cookies.loggedin === hash(request.params.username)) {
                        console.log("THERE ARE RESULTS FROM CATEGORIES")
                        // response.send(results);
                        data.categories = results.rows;

                        var callback2 = function (error,results2) {
                            if (results===null){
                                response.send("NO DATA")
                            } else {
                                console.log("THERE ARE RESULTS FROM TXN TYPES")
                                data.types = results2.rows;
                                // response.send(data)
                                response.render('pages/AddTxn', data)
                            }
                        }
                        db.users.getTxnTypes(callback2);
                }  else {
                    response.redirect('/')
                }
            }
        };
        db.users.getCategories(callback);
    }


    let addTransaction = (request,response) => {
        // response.send("ADDED TRANSACTION!")
        var callback = function (error,results) {

            if (results===null){

                response.send("NO DATA")

            } else {
                if (request.cookies.loggedin === hash(request.params.username)) {
                    // console.log(request.cookies)
                    console.log("REQUEST params IS")
                    console.log(request.params.username);
                    response.redirect('/home/'+request.params.username )
                    // response.redirect('/')
                    // response.redirect('/user/'+results[0].id);
                } else {
                    response.redirect('/')
                }
            }
        }
        db.users.postTxn(callback, request.body.amount, request.body.transaction_date, request.body.transaction_type, request.body.category_id, request.cookies.userid, request.body.details);
    };


    let showTransaction = (request,response) => {
        let data = {
            categories: null,
            types: null,
            username: [request.params.username],
            txnData: null
        };

        var callbackCat = function (error,results) {
            if (results===null){
                response.send("NO DATA")
            } else {
                if (request.cookies.loggedin === hash(request.params.username)) {
                        console.log("THERE ARE RESULTS FROM CATEGORIES")
                        // response.send(results);
                        data.categories = results.rows;

                        var callbackTxnType = function (error,results2) {
                            if (results===null){
                                response.send("NO DATA")
                            } else {
                                console.log("THERE ARE RESULTS FROM TXN TYPES")
                                data.types = results2.rows;

                                var callbackTxnData = function (error,results3) {
                                    if (results===null){
                                        response.send("NO TXN DATA")
                                    } else {
                                        console.log("THERE ARE RESULTS FROM TXN DATA");
                                        console.log(results3);
                                        data.txnData = results3;
                                        // response.send(data);
                                        response.render("pages/EditTxn",data)
                                    }
                                }
                                db.users.showTxn(callbackTxnData,request.params.txnId, request.params.username);

                            }

                        }
                        db.users.getTxnTypes(callbackTxnType);
                }  else {
                    response.redirect('/')
                }
            }
        };
        db.users.getCategories(callbackCat);
    }


    let editTransaction = (request,response) => {
        // response.send("ADDED TRANSACTION!")
        var callback = function (error,results) {

            if (results===null){

                response.send("NO DATA")

            } else {
                if (request.cookies.loggedin === hash(request.params.username)) {
                    // console.log(request.cookies)
                    console.log("REQUEST params IS")
                    console.log(request.params.username);
                    response.redirect('/home/'+request.params.username )
                    // response.redirect('/')
                    // response.redirect('/user/'+results[0].id);
                } else {
                    response.redirect('/')
                }
            }
        }
        db.users.editTxn(callback, request.body.amount, request.body.transaction_date, request.body.transaction_type, request.body.category_id, request.cookies.userid, request.body.details, request.params.txnId);
    };





  /**
   * ===========================================
   * Export controller functions as a module
   * ===========================================
   */
  return {
    // redirect: redirectPage,
    // login: displayLoginPage,
    // loginCheck: checkUserCallback,
    // register:displayRegisterPage,
    home: displayHomePage,
    transactions: displayTransactions,
    newTxnPage: newTransaction,
    addTxn: addTransaction,
    editTxnPage: showTransaction,
    editTxn: editTransaction,
  };

}