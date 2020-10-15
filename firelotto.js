"use strict";

/**
 * Copyright (c) 2018 Fire Lotto
 *
 * This is open-source part of Fire Lotto (firelotto.com)
 *
 * This class contains full code, responsible for working
 * with Fire Lotto smart-contract (including the purchase of tickets)
 *
 * Your can review this file on production: https://firelotto.com/js/api.js
 */

var ApiPromise;

(function () {
    /**
     * @param fn    function (onResult, onError)
     */
    ApiPromise = function ApiPromise(fn) {
        this.fn = fn;

        this.destroyed = false;
    };

    ApiPromise.prototype.then = function (onSuccess, onFailed) {
        var self = this;

        function onResult(result) {
            if (!self.destroyed) {
                onSuccess(result);
            }
        }

        function onError(error) {
            if (!self.destroyed) {
                onFailed(error);
            }
        }

        self.fn(onResult, onError);
    };

    ApiPromise.prototype.destroy = function () {
        this.destroyed = true;
    };

    ApiPromise.all = function (promises) {
        return new ApiPromise(function (onResult, onError) {
            var results = [];
            var completed = 0;
            var hasError = false;

            function onChildResult(i, data) {
                results[i] = data;
                checkDone();
            }

            function onChildError(i, error) {
                hasError = true;
                checkDone();
            }

            function checkDone() {
                completed++;
                if (completed === promises.length) {
                    done();
                }
            }

            function done() {
                if (hasError) {
                    onError();
                } else {
                    onResult(results);
                }
            }

            function runPromise(i) {
                promises[i].then(function (result) {
                    onChildResult(i, result);
                }, function (error) {
                    onChildError(i, error);
                });
            }

            if (promises.length === 0) {
                onResult([]);
            } else {
                for (var i = 0; i < promises.length; i++) {
                    runPromise(i);
                }
            }
        });
    };
})();

var Api;

(function () {

    Api = function Api() {
        this.web3 = new Web3();
        this.web3.setProvider(new this.web3.providers.HttpProvider('https://mainnet.infura.io/v3/3c1bc7da4f0048e5a970280b2b3178f6'));
        // this.web3.setProvider(new this.web3.providers.HttpProvider('https://firelotto.com/eth'));

        this.gameClass = this.web3.eth.contract(JSON.parse('[{"constant":true,"inputs":[],"name":"ticketCountMax","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"value","type":"uint256"},{"name":"to","type":"address"}],"name":"transferFromReserve","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_intervalTime","type":"uint256"}],"name":"setIntervalTime","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"games","outputs":[{"name":"startTime","type":"uint256"},{"name":"jackpot","type":"uint256"},{"name":"reserve","type":"uint256"},{"name":"price","type":"uint256"},{"name":"winNumbers","type":"bytes"},{"name":"checkTicketIndex","type":"uint256"},{"name":"checkWinTicketIndex","type":"uint256"},{"name":"checkWinTicketLevel","type":"uint256"},{"name":"needPlayersTransfer","type":"uint256"},{"name":"addToJackpotAmount","type":"uint256"},{"name":"addToReserveAmount","type":"uint256"},{"name":"bitcoinBlockIndex","type":"uint256"},{"name":"bitcoinBlockHash","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"drawer","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"technicalPercent","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_nextPrice","type":"uint256"}],"name":"setNextPrice","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"isNeedCloseCurrentGame","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_ticketCountMax","type":"uint256"}],"name":"setTicketCountMax","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_needToReserve","type":"uint256"}],"name":"setNeedToReserve","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"bitcoinBlockHash","type":"string"},{"name":"numbersCount","type":"uint256"},{"name":"numbersCountMax","type":"uint256"}],"name":"getWinNumbers","outputs":[{"name":"","type":"bytes"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":true,"inputs":[],"name":"gasMin","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"buyEnable","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"winPercent","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_prPercent","type":"uint256"}],"name":"setPrPercent","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_buyEnable","type":"bool"}],"name":"setBuyEnable","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_prWallet","type":"address"}],"name":"setPrWallet","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"prWallet","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_disableBuyingTime","type":"uint256"}],"name":"setDisableBuyingTime","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"needToReserve","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"gameIndex","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"jackpotGuaranteed","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"checkGameIndex","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"isNeedCheckTickets","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"closeTime","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"gameIndex","type":"uint256"},{"name":"offset","type":"uint256"},{"name":"count","type":"uint256"}],"name":"getWins","outputs":[{"name":"wins","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"bitcoinBlockIndex","type":"uint256"}],"name":"isNeedDrawGame","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_dividendsWallet","type":"address"}],"name":"setDividendsWallet","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"startTime","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"gameIndexToBuy","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"technicalWallet","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_dividendsPercent","type":"uint256"}],"name":"setDividendsPercent","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"addReserve","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"_technicalWallet","type":"address"}],"name":"setTechnicalWallet","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"bitcoinBlockIndex","type":"uint256"}],"name":"closeCurrentGame","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_jackpotGuaranteed","type":"uint256"}],"name":"setJackpotGuaranteed","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"disableBuyingTime","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"player","type":"address"},{"name":"offset","type":"uint256"},{"name":"count","type":"uint256"}],"name":"getPlayerTickets","outputs":[{"name":"tickets","type":"int256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"bonusAddress","type":"address"},{"name":"value","type":"bool"}],"name":"setBonusAddress","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"offset","type":"uint256"},{"name":"count","type":"uint256"}],"name":"getGames","outputs":[{"name":"res","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_technicalPercent","type":"uint256"}],"name":"setTechnicalPercent","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"addBalance","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"value","type":"uint256"},{"name":"to","type":"address"}],"name":"transferFromBalance","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"startTime","type":"uint256"}],"name":"setNextStartTime","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"numbers","type":"uint256[]"},{"name":"bonusAddress","type":"address"}],"name":"buyTicket","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"_gasMin","type":"uint256"}],"name":"setGasMin","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"numbersCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"bitcoinBlockIndex","type":"uint256"},{"name":"bitcoinBlockHash","type":"string"}],"name":"drawGame","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"prPercent","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"dividendsWallet","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_winPercent","type":"uint256[]"}],"name":"setWinPercent","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"nextPrice","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"dividendsPercent","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"checkTickets","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"numbersCountMax","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_drawer","type":"address"}],"name":"setDrawer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"intervalTime","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"array","type":"bytes"}],"name":"noDuplicates","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"pure","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"gameIndex","type":"uint256"},{"indexed":false,"name":"riseAmount","type":"uint256"},{"indexed":false,"name":"technicalAmount","type":"uint256"},{"indexed":false,"name":"dividendsAmount","type":"uint256"},{"indexed":false,"name":"prAmount","type":"uint256"}],"name":"LogTransfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"gameIndex","type":"uint256"},{"indexed":false,"name":"startTime","type":"uint256"},{"indexed":false,"name":"bitcoinBlockIndex","type":"uint256"},{"indexed":false,"name":"numbers","type":"bytes"},{"indexed":false,"name":"riseAmount","type":"uint256"},{"indexed":false,"name":"transferAmount","type":"uint256"},{"indexed":false,"name":"addToJackpotAmount","type":"uint256"},{"indexed":false,"name":"addToReserveAmount","type":"uint256"}],"name":"LogDraw","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"gameIndex","type":"uint256"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"LogReserveUsed","type":"event"}]'));

        this.contracts = [];

        for (var i = 0; i < this.contractAddresses.length; i++) {
            this.contracts.push([this.gameClass.at(this.contractAddresses[i][0]), this.gameClass.at(this.contractAddresses[i][1]), this.gameClass.at(this.contractAddresses[i][2]), this.gameClass.at(this.contractAddresses[i][3])]);
        }
    };

    /**
     * Addresses of lotteries smart-contracts.
     * Current is first, older is last.
     */
    Api.prototype.contractAddresses = [['0x2020fE9fA0f43fDe44360AAe03138C4B6AB35055', '0x10C621008B210C3A5d0385e458B48af05BF4Ec88', '0x2734B99e2C62cA70fE753a0cbcD3a90930E1EEC9', '0x0adB01598E6e1EA8F9f8C95B0e7C65D34C8B064B'], ['0xa0306fCaE88f84CBBe2CF784B1046A94DeF54015', '0xd06FD155421a993057113f5e2597Bf65b9f42b00', '0xE044e2eb641Efa48B97ef05c24f70F7675D2D404', '0x0adB01598E6e1EA8F9f8C95B0e7C65D34C8B064B'], ['0x9f3eae582f7541e673fe486900cc5539b8f24c8e', '0xc1abd580ac9545f771f3c430bbfdc8792ff3f987', '0xcce900b307443c2b600a21b82c8e0b8d9279bfd1', '0x0adB01598E6e1EA8F9f8C95B0e7C65D34C8B064B']];

    Api.prototype.startGameIndices = [[77, 82, 81, 0], [25, 25, 24, 0], [0, 0, 0, 0]];

    Api.prototype.getContractIndex = function (gameTypeIndex, gameIndex) {
        for (var i = this.startGameIndices.length - 1; i >= 1; i--) {
            var startGameIndex = this.startGameIndices[i - 1][gameTypeIndex];
            if (gameIndex < startGameIndex) return i;
        }
        return 0;
    };

    Api.prototype.gameNumbersCount = [4, 5, 6, 6];

    Api.prototype.gameNumbersCountMax = [20, 36, 45, 45];

    Api.prototype.buyTicketLimit = 30;

    Api.prototype.buyTicketGasLimit = 170000;

    Api.prototype.getTicketGasLimit = function (gameTypeIndex) {
        return 170000;
    };

    Api.prototype.getBlock = function () {
        this.web3.eth.getBlock('pending', function (error, block) {
            console.log('blockNumber = ' + block.number);
            console.log('hash = ' + block.hash);
        });

        console.log('blockNumber = ' + this.web3.eth.blockNumber);
    };

    /**
     * @return ApiPromise
     */
    Api.prototype.getGames = function (gameTypeIndex, offset, count) {
        var self = this;

        return new ApiPromise(function (onResult, onError) {
            var promises = [];

            var len = gameTypeIndex == 3 ? 1 : self.contracts.length;

            for (var i = 0; i < len; i++) {
                var startGameIndex = self.startGameIndices[i][gameTypeIndex];
                promises.push(self.getGamesImpl(i, gameTypeIndex, offset, count, startGameIndex));
            }

            ApiPromise.all(promises).then(function (results) {
                var allGames = [];
                for (var i = 0; i < results.length; i++) {
                    if (i > 0) results[i].shift();
                    allGames = allGames.concat(results[i]);
                }
                onResult(allGames);
            }, onError);
        });
    };

    /**
     * @return ApiPromise
     */
    Api.prototype.getGamesImpl = function (contractIndex, gameTypeIndex, offset, count, startGameIndex) {
        var contract = this.contracts[contractIndex][gameTypeIndex];
        var numbersCount = this.gameNumbersCount[gameTypeIndex];

        var self = this;

        return new ApiPromise(function (onResult, onError) {
            contract.jackpotGuaranteed(function (error, jackpotGuaranteed) {
                if (error || jackpotGuaranteed.eq(0)) {
                    console.error(error);
                    onError(error);
                } else {
                    contract.getGames(offset, count, function (error, res) {
                        if (error) {
                            console.error(error);
                            onError(error);
                        } else {
                            var games = [];
                            var i = 0;

                            while (i < res.length) {
                                var item = {
                                    gameIndex: res[i++].toNumber() + startGameIndex,
                                    startTime: res[i++].toNumber(),
                                    jackpot: self.web3.fromWei(res[i++]),
                                    reserve: self.web3.fromWei(res[i++]),
                                    price: self.web3.fromWei(res[i++]),
                                    ticketCount: res[i++].toNumber(),
                                    riseAmount: self.web3.fromWei(res[i - 1].mul(res[i - 2])),
                                    needPlayersTransfer: self.web3.fromWei(res[i++]),
                                    addToJackpotAmount: self.web3.fromWei(res[i++]),
                                    addToReserveAmount: self.web3.fromWei(res[i++]),
                                    bitcoinBlockIndex: res[i++].toNumber(),
                                    numbers: res.slice(i, i + numbersCount).map(function (value) {
                                        return value.toNumber();
                                    }),
                                    jackpotGuaranteed: self.web3.fromWei(jackpotGuaranteed)
                                };

                                item.finalJackPot = getJackPot(item, gameTypeIndex);

                                item.numbers.sort(function (a, b) {
                                    return a - b;
                                });
                                games.push(item);
                                i += numbersCount;
                            }

                            onResult(games);
                        }
                    });
                }
            });
        });
    };

    /**
     * @return ApiPromise
     */
    Api.prototype.getPlayerTickets = function (gameTypeIndex, address, offset, count) {
        var self = this;

        return new ApiPromise(function (onResult, onError) {
            var promises = [];

            var len = gameTypeIndex == 3 ? 1 : self.contracts.length;

            for (var i = 0; i < len; i++) {
                var startGameIndex = self.startGameIndices[i][gameTypeIndex];
                promises.push(self.getPlayerTicketsImpl(i, gameTypeIndex, address, offset, count, startGameIndex));
            }

            ApiPromise.all(promises).then(function (results) {
                var allTickets = [];
                for (var i = 0; i < results.length; i++) {
                    allTickets = allTickets.concat(results[i]);
                }
                onResult(allTickets);
            }, onError);
        });
    };

    /**
     * @return ApiPromise
     */
    Api.prototype.getPlayerTicketsImpl = function (contractIndex, gameTypeIndex, address, offset, count, startGameIndex) {
        var self = this;
        var contract = this.contracts[contractIndex][gameTypeIndex];
        var numbersCount = this.gameNumbersCount[gameTypeIndex];

        return new ApiPromise(function (onResult, onError) {
            contract.getPlayerTickets(address, offset, count, function (error, res) {
                if (!error) {
                    var tickets = [];
                    var i = 0;

                    while (i < res.length) {
                        var item = {
                            gameIndex: res[i++].toNumber() + startGameIndex,
                            ticketIndex: res[i++].toNumber(),
                            startTime: res[i++].toNumber(),
                            winAmount: self.web3.fromWei(res[i++]),
                            price: res[i++],
                            numbers: res.slice(i, i + numbersCount).map(function (value) {
                                return value.toNumber();
                            })
                        };
                        tickets.push(item);
                        i += numbersCount;
                    }

                    onResult(tickets);
                } else {
                    console.error(error);
                    onError(error);
                }
            });
        });
    };

    /**
     * @return ApiPromise
     */
    Api.prototype.getBalanceNumber = function (address) {
        var self = this;

        return new ApiPromise(function (onResult, onError) {
            self.web3.eth.getBalance(address, function (error, balance) {
                if (error) {
                    onError(error);
                } else {
                    onResult(self.web3.fromWei(balance));
                }
            });
        });
    };

    /**
     * @return ApiPromise
     */
    Api.prototype.getWinHistory = function (gameTypeIndex, gameIndex, offset, count) {
        var contractIndex = this.getContractIndex(gameTypeIndex, gameIndex);
        var contract = this.contracts[contractIndex][gameTypeIndex];
        var startGameIndex = this.startGameIndices[contractIndex][gameTypeIndex];

        return this.getWinHistoryImpl(contract, gameTypeIndex, gameIndex - startGameIndex, offset, count, startGameIndex);
    };

    Api.prototype.toAddress = function (number) {
        var res = number.toString(16);
        if (res.length < 40) res = '0' + res;
        return '0x' + res;
    };

    /**
     * @return ApiPromise
     */
    Api.prototype.getWinHistoryImpl = function (contract, gameTypeIndex, gameIndex, offset, count, startGameIndex) {
        var self = this;

        return new ApiPromise(function (onResult, onError) {
            contract.getWins(gameIndex, offset, count, function (error, res) {
                if (!error) {
                    var wins = [];
                    var i = 0;

                    while (i < res.length) {
                        var item = {
                            user: self.toAddress(res[i++]),
                            numbersCount: res[i++].toNumber(),
                            ticketIndex: res[i++].toNumber(),
                            winAmount: self.web3.fromWei(res[i++]),
                            gameIndex: gameIndex + startGameIndex
                        };
                        wins.push(item);
                    }

                    onResult(wins);
                } else {
                    console.error(error);
                    onError(error);
                }
            });
        });
    };

    /*    Api.prototype.getEvent = function (game, name, filter, callback) {
            game[name](filter, {fromBlock: 0, toBlock: 'latest'}).get(function (error, result) {
                if (error) {
                    callback(error);
                } else {
                    var list = result.map(function (event) {
                        return event.args;
                    });
                    callback(null, list);
                }
            });
        };*/

    /**
     * @returns String
     */
    Api.prototype.getNumbersData = function (numbersList, referalId) {
        var to2 = function to2(x) {
            var str = x.toString();
            if (str.length == 1) str = "0" + str;
            return str;
        };

        var data = "0x";
        if (referalId == 0) {
            for (var i = 0; i < numbersList.length; i++) {
                data += to2(numbersList[i]);
            }
        } else {
            var shift = referalId % 10;
            if (shift == 0) shift = 1;

            for (i = 0; i < numbersList.length; i++) {
                data += to2((numbersList[i] + shift).toString(16));
            }
            if (referalId > 255) {
                data += to2((referalId >> 8 & 0xFF).toString(16));
                data += to2((referalId & 0xFF).toString(16));
            } else {
                data += to2(referalId.toString(16));
            }
        }
        return data;
    };

    /*    Api.prototype.privateKeyToAddress = function (privateKey) {
            var privateKeyBuffer = new EthJS.Buffer.Buffer(privateKey, 'hex');
            var address = '0x' + EthJS.Util.privateToAddress(privateKeyBuffer).toString('hex');
            return address;
        };*/

    /*    Api.prototype.getGasPrice = function (callback) {
            this.web3.eth.getGasPrice(function (error, gasPrice) {
                var defaultPrice = new BigNumber(21000000000);
                 var res = error ? defaultPrice : gasPrice;
                console.log('getGasPrice = ' + res);
                 callback(res);
            });
        };*/

    /**
     * @return ApiPromise
     */
    Api.prototype.getGasPrice2 = function () {
        var url = 'https://ethgasstation.info/json/ethgasAPI.json';
        var defaultPrice = new BigNumber(21000000000);

        return new ApiPromise(function (onResult, onError) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.onreadystatechange = function () {
                if (this.readyState == 4) {
                    console.log(this.responseText);

                    try {
                        var responseData = JSON.parse(this.responseText);
                        var res = new BigNumber(responseData.average * 100000000);
                        console.log('getGasPrice = ', res.toNumber() / 1000000000);
                        onResult(res);
                    } catch (error) {
                        console.log(error);
                        onResult(defaultPrice);
                    }
                }
            };
            xhr.send();
        });
    };

    Api.prototype.buyTicket = function (gameIndex, numbers, price, ticketCount, privateKey, gasPrice, callback, onProgress) {

        price = this.web3.toWei(price);

        console.log('buyTicket numbers: ' + numbers);

        var privateKeyBuffer = new EthJS.Buffer.Buffer(privateKey, 'hex');
        var playerAddress = '0x' + EthJS.Util.privateToAddress(privateKeyBuffer).toString('hex');
        console.log('playerAddress = ' + playerAddress);

        var self = this;

        var runMethod = function runMethod(f, arg, onResult) {
            var _callback = function _callback(error, res) {
                if (error) {
                    callback(error, playerAddress);
                } else {
                    onResult(res);
                }
            };
            if (arg) {
                f(arg, _callback);
            } else {
                f(_callback);
            }
        };

        runMethod(self.web3.eth.getBalance, playerAddress, function (balance) {

            if (price.gt(balance)) {
                callback('no money', playerAddress);
                return;
            }

            runMethod(self.web3.eth.getTransactionCount, playerAddress, function (txCount) {

                var contractData = self.contracts[0][gameIndex].buyTicket.getData(numbers, 0);
                var txParams = {
                    nonce: self.web3.toHex(txCount),
                    gasPrice: self.web3.toHex(gasPrice),
                    gasLimit: self.web3.toHex(self.buyTicketGasLimit * ticketCount),
                    from: playerAddress,
                    to: self.contractAddresses[0][gameIndex],
                    value: self.web3.toHex(price),
                    data: contractData
                };
                console.log(txParams);
                var tx = new EthJS.Tx(txParams);
                tx.sign(privateKeyBuffer);
                var serializedTx = tx.serialize().toString('hex');
                runMethod(self.web3.eth.sendRawTransaction, '0x' + serializedTx, function (txhash) {
                    console.log('pending tx ' + txhash);
                    onProgress(txhash);

                    var waitReceipt = function waitReceipt(txhash, callback) {
                        runMethod(self.web3.eth.getTransactionReceipt, txhash, function (receipt) {
                            if (receipt && receipt.transactionHash == txhash) {
                                callback(receipt);
                            } else {
                                setTimeout(waitReceipt, 5000, txhash, callback);
                            }
                        });
                    };

                    waitReceipt(txhash, function (receipt) {

                        console.log('receipt', receipt);

                        callback(receipt.status == 1 ? null : 'error', playerAddress, txhash);
                    });
                });
            });
        });
    };

    function hexToBytes(hex) {
        for (var bytes = [], c = 2; c < hex.length; c += 2) {
            bytes.push(parseInt(hex.substr(c, 2), 16));
        }return bytes;
    }

    var _metamask = null;

    Api.prototype.getMetamask = function () {
        if (!_metamask) {
            if (typeof web3 !== 'undefined') {

                //console.log('Metamask detected!!!');
                //console.log(web3.eth.accounts[0]);

                _metamask = new Web3(web3.currentProvider);
            } else {
                //console.log('Metamask not found!!!');
            }
        }

        return _metamask;
    };
})();