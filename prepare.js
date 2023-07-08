const Web3 = require('web3')
const dotenv = require('dotenv')
const { abi: CONTRACT_ABI } = require('./build/contracts/AEACoin.json')

dotenv.config()

const { PROJECT_ID, CONTRACT_ADDRESS, PRIVATE_KEY, DAD_ADDRESS, MOM_ADDRESS, 
        ALICE_ADDRESS } = process.env
const providerURL = `https://goerli.infura.io/v3/${PROJECT_ID}`
const web3 = new Web3(providerURL)

const account = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY)
const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS)

async function contractMethodSend(transaction, account) {
    const gas = await transaction.estimateGas({from: account.address})

    const options = {
        to: transaction._parent._address,
        data: transaction.encodeABI(),
        gas,
    }

    const signedTransaction = await web3.eth.accounts.signTransaction(options, account.privateKey)

    const transactionReceipt = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction)

    return transactionReceipt
}

async function main() {
    const contractBalance = await contract.methods.balanceOf(CONTRACT_ADDRESS).call()
    console.log(Web3.utils.fromWei(contractBalance))

    await contractMethodSend(
        contract.methods.addParent(DAD_ADDRESS),
        account
    )

    await contractMethodSend(
        contract.methods.addParent(MOM_ADDRESS),
        account
    )

    await contractMethodSend(
        contract.methods.addKid(ALICE_ADDRESS),
        account
    )

    console.log(await contract.methods.isParent(DAD_ADDRESS).call())

    const amount = Web3.utils.toWei('10000', 'ether')

    await contractMethodSend(
        contract.methods.chargeCoins(amount),
        account
    )
}

main()
