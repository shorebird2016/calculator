angular.module('calcApp', [])
    .controller('calcCtrl', [ function () {
        var vm = this;
        vm.display = 0;//value shown on LCD
        vm.userEntry = '';//data model, stored as string
        vm.newEntry = true;
        vm.periodEntered = false;
        vm.result = undefined;//store number (not string), holds intermediate results when chained
        vm.prevOp = undefined;//look ahead operator

        //---wait for entry methods
        //---a digit was clicked
        vm.digitClicked = function (digit) {
            if (vm.userEntry.length == 10) return;//exceeding limit
            if (vm.newEntry) {
                vm.userEntry = digit;
                vm.newEntry = false;
            }
            else
                vm.userEntry = vm.userEntry + digit;//simple append
            vm.display = vm.userEntry;//copy to display
        };

        //---period was clicked
        vm.periodClicked = function () {
            if (vm.userEntry.length == 10) return;//exceeding limit
            if (vm.periodEntered) return;//do not allow more than period
            vm.periodEntered = true;//parse on equal
            vm.userEntry += '.';
            vm.display = vm.userEntry;//copy to display
        };

        //---plus or minus sign clicked
        vm.signClicked = function () {
            if (vm.userEntry[0] === '-')
                vm.userEntry = vm.userEntry.substr(1, vm.userEntry.length);
            else
                vm.userEntry = '-' + vm.userEntry;
            vm.display = vm.userEntry;//copy to display
        };

        //---CE clicked, remove last entry
        vm.ceClicked = function () {
            vm.periodEntered = false;
            vm.newEntry = true;
            vm.userEntry = '';
            vm.display = "0";
        };

        //---C clicked
        vm.cClicked = function () {
            vm.periodEntered = false;
            vm.newEntry = true;
            vm.result = undefined;
            vm.userEntry = '';
            vm.display = "0";//TODO what's diff from CE??????
        };

        //---operator clicked
        vm.operatorClicked = function (op) {
            if (vm.result === undefined) {//xfer user entry to result when no result is around
                if (vm.userEntry === "") return; //nop both empty
                if (op === '=') {
                    //new entry cycle
                    vm.newEntry = true;
                    vm.periodEntered = false;
                    vm.userEntry = "";
                    return;
                }
                //+ - x / operators, get user entry, put into result as real number
                vm.result = parseFloat(vm.userEntry);
                vm.prevOp = op;
                vm.newEntry = true;
                vm.periodEntered = false;
                vm.userEntry = "";
                return;
            }

            if (vm.userEntry === "") return; //cases when operator follows another operator
            //already has result, operate on both
            var entry = parseFloat(vm.userEntry);
            switch(vm.prevOp) {//already has operand, operate operand vs currentEntry, save in operand, clear currentEntry
                case '+':
                    vm.result += entry;
                    break;

                case '-':
                    vm.result -= entry;
                    break;

                case 'x':
                    vm.result *= entry;
                    break;

                case '/':
                    if (entry === 0)
                        vm.result = NaN;
                    else
                        vm.result /= entry;
                    break;
            }

            //apply formatting on result
            var df1 = new DecimalFormat("#,##0.00");
            // var df2 = new DecimalFormat("0.##E0");
            if (vm.result > 100000000)
                // vm.display = df2.format(vm.result); TODO this does NOT work
                vm.display = vm.result.toPrecision(8.2);
            else
                vm.display = df1.format(vm.result);

            //new entry cycle
            vm.newEntry = true;
            vm.periodEntered = false;
            vm.userEntry = '';
            vm.prevOp = op;
            if (op === '=') {
                vm.result = undefined;//start over after finish
            }
        };
    }]);

//TODO - LCD scroll left should be hidden outside left bound
//TODO - handle vm.currentEntry to be NaN