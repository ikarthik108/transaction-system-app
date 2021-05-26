'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // 
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');



//Declaring Functions

const displayMovements=function(movements) {
  containerMovements.innerHTML='';

  movements.forEach(function(movement,i){
    const type=movement>0?'deposit':'withdrawal'
    const html=`
                <div class="movements__row">
                  <div class="movements__type movements__type--${type}">${i+1} ${type}</div>
                  <div class="movements__value">${movement}</div>
                </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin',html)
  })

}
// displayMovements(userAccount.movements)



const calcDisplayBalance=function(account) {

  const balance=account.movements.reduce((acc,movement)=>acc+movement,0)
  // console.log(balance);
  labelBalance.textContent=`${balance} EUR`
  account.balance=balance;

}

// calcDisplayBalance(userAccount.movements)




const calcDisplaySummary=function(acc) {

  const movements=acc.movements;

  //displaying Deposit Summary
  const depositSummary=acc.movements.filter(mov=>mov>0).reduce((acc,mov)=>acc+mov,0)
  labelSumIn.textContent=`${depositSummary} EUR`

  //displaying Withdrawal Summary
  const withdrawalSummary=movements.filter(mov=>mov<0).reduce((acc,mov)=>acc+Math.abs(mov),0)
  labelSumOut.textContent=`${withdrawalSummary} EUR`

  //displaying InterestSummary(1.2% interest on each deposit)
  const interestRate=acc.interestRate
  const interestMoney=movements.filter(mov=>mov>0).reduce((acc,movement)=>{console.log(interestRate)
   return movement*(1.2/100) >=1 ? acc + movement*(interestRate/100) : acc
  },0)
  labelSumInterest.textContent=`${interestMoney} EUR`
}

// calcDisplaySummary(userAccount.movements)


const createUserName=function (accs) {
  accs.forEach((account)=>  {
    const user=account.owner;
    const words=user.split(" ")
    const userName=words.map(word=>word[0]).join("").toLowerCase();
    console.log(userName)
    account.userName=userName   
    console.log(account)
  })

}

createUserName(accounts)


const updateUI=function(acc) {
  //display movements
    
  displayMovements(acc.movements)

  //display balance
  calcDisplayBalance(acc)

  //display Summary
  calcDisplaySummary(acc)

}

//add event lisneters
let currentAccount;
btnLogin.addEventListener('click',function(event) {
  event.preventDefault()
  console.log('Login Button Clicked')
  currentAccount=accounts.find(acc=> acc.userName===inputLoginUsername.value)

  if(currentAccount?.pin===Number(inputLoginPin.value)) {
    console.log("Passwords Match")

    //Display WELCOME MESSAGE AND UI
    labelWelcome.textContent=`Welcome Back, ${currentAccount.owner.split(" ")[0]}`
    containerApp.style.opacity=1;

    //Clear Login & pw input fields
    inputLoginPin.value=inputLoginUsername.value=""


    updateUI(currentAccount)
    
    

  } else {
      console.log("Incorrect Credentials")
  }
  
})


//transfer Money
btnTransfer.addEventListener('click',function(event) {
  event.preventDefault()
  console.log('Transfer button clicked')

  //find useraccount to transfer
  const transferAccount=accounts.find(account=>account.userName===inputTransferTo.value)
  console.log("Transfer Account",transferAccount)

  //Enter the Amount to transfer
  const amtToTransfer=Number(inputTransferAmount.value);

  const currentAccountBalance=currentAccount.balance
  inputTransferAmount.value=inputTransferTo.value=''
  if(transferAccount && currentAccountBalance>=amtToTransfer && amtToTransfer>0 && transferAccount!==currentAccount) {
    
    //amt will be pushed to the current user movements array as withdrawal (debited from user account)
    console.log('Current Account',currentAccount)
    currentAccount.movements.push(amtToTransfer*-1)
    console.log(currentAccount.movements)

    //Credit Amount as deposit to the account movements of the usertransfer;
    transferAccount.movements.push(amtToTransfer)

    //redisplay Movements array for the current user with the updated balance and summary
      
    updateUI(currentAccount)
  } else {
    console.log("Account Not Found,or Insufficient Balance")
  }
  
})

//request loan event listener

btnLoan.addEventListener('click',function(event) {
  event.preventDefault();
  const loanAmt=Number(inputLoanAmount.value);
  const minDeposit=(10/100) * loanAmt;
  if(currentAccount.movements.some(mov=>mov>=minDeposit) && loanAmt>0) {
    console.log('Loan will be sanctioned')
    //Credit LoanAmount as deposit to the account movements of the current user;
    currentAccount.movements.push(loanAmt)

    //redisplay Movements array for the current user with the updated balance and summary  
    updateUI(currentAccount)

    //clear the i/p field
    inputLoanAmount.value=""


  } else {
    console.log("nahi hoga")
  }

})

//delete Account event listener

btnClose.addEventListener('click',function(event) {
  event.preventDefault()
  console.log('Close account button clicked;')

  //check if the credentials are correct
  if(Number(inputClosePin.value)===currentAccount.pin &&inputCloseUsername.value=== currentAccount.userName) {
    console.log("Correct credentials")


    //find account in the accounts array
    const indexOfAcc=accounts.findIndex(account=>account===currentAccount)
    console.log(indexOfAcc)

    //delete user account from the array

    accounts.splice(indexOfAcc,1)
    console.log(accounts)

    //logout the user(hide UI)
    containerApp.style.opacity=0;
    labelWelcome.textContent=`Log in to get started`

  }
  else {
    console.log("Wrong credentials")
  }

})













//Practice
// const max=account1.movements.reduce((acc,movement)=> {
//   if(movement>acc) {
//     acc=movement
//     return acc
//   } else {
//     return acc
//   }
// },account1.movements[0])



// //map
// const movementsUsd=account1.movements.map((movement)=>{return movement*1.1})
// console.log(account1.movements)
// console.log(movementsUsd)

// const movementDesc=account1.movements.map((movement,index,array)=> {
//   if(movement>0) {
//     return `Movement ${index+1}:You deposited ${movement}`
//   } return `Movement ${index+1}:You withdrawed ${Math.abs(movement)}`
// })

// console.log(movementDesc)


// const user="Steven Thomas Williams"


//forEach and Map Combination
// const createUserName=function (accs) {
//   accs.forEach((account)=>  {
//     const user=account.owner;
//     const words=user.split(" ")
//     const userName=words.map(word=>word[0]).join("").toLowerCase();
//     console.log(userName)
//     account.userName=userName   
//     console.log(account)
//   })

// }

// createUserName(accounts)


// //Reduce practice
// const a1=[5,2,4,1,15,8,3]
// const calcAverageHumanAge=function(dogAges) {
//   console.log("Original Ages",dogAges)
//   const ageInHumanYears=dogAges.map(age=> age<=2 ? 2*age: 16 + age*4 );
//   console.log(ageInHumanYears)
//   const filteredDogs=ageInHumanYears.filter(age=> age>=18)
//   console.log(filteredDogs)

//   //calculate average human age of all adult dogs i/p:[36, 32, 76, 48, 28]

//   const avgAge=filteredDogs.reduce((acc,age)=> acc+ age,0) / filteredDogs.length
//   return avgAge
//   // o/p:[44]
// }


// calcAverageHumanAge(a1)

// //take mov deposits/convert from euros to dollars/add them all up/ (use chaining)


// const totalDeposit=function(movements) {
//   console.log("Move",movements)
//   const deposits=movements.filter(movement=> movement>0).map(current=>current*1.1).reduce((acc,current)=> acc+current,0)
//   console.log(deposits)

// }

// const totalDepositOptimized=function(movements) {
//   const ans=movements.reduce((acc,movement,i,array)=> {
//     if(movement>0) {
//       return acc + movement*1.1
//     } return acc

//   },0)
//   console.log(ans)
// }

// totalDeposit(account1.movements)
// totalDepositOptimized(account1.movements)

//movements: [200, 450, -400, 3000, -650, -130, 70, 1300]



//deposits: [200,450,3000,70,1300]
//[220,495,3300,77,1430]


// console.log(accounts)
// const account=accounts.find(acc=>acc.owner=== 'Jessica Davis')
// console.log(account)

// console.log("-----forOf----")
// for(let account of accounts) {
//   if(account.owner==='Jessica Davis') {
//     console.log(account)
//   }
// }





