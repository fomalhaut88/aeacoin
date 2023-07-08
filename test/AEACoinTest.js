const Web3 = require('web3')
const AEACoin = artifacts.require("AEACoin")

contract("AEACoin", (accounts) => {
    const initialSupply = Web3.utils.toWei('1000', 'ether')
    const [mom, dad, alice, bob] = accounts
    let contractInstance = null

    beforeEach(async () => {
        contractInstance = await AEACoin.new("AEA Coin", "AEAC", initialSupply, {from: dad})
    })

    it("Basic test", async () => {
        const value = await contractInstance.totalSupply()
        assert.equal(value, initialSupply)

        const name = await contractInstance.name()
        assert.equal(name, "AEA Coin")

        const symbol = await contractInstance.symbol()
        assert.equal(symbol, "AEAC")
    })

    it("Ownable test", async () => {
        const dadIsOwner = await contractInstance.isOwner(dad)
        assert.ok(dadIsOwner)

        const momIsOwner = await contractInstance.isOwner(mom)
        assert.ok(!momIsOwner)

        await contractInstance.changeOwner(mom, {from: dad})

        const momIsOwner2 = await contractInstance.isOwner(mom)
        assert.ok(momIsOwner2)
    })

    it("Parent test", async () => {
        const dadIsParent = await contractInstance.isParent(dad)
        assert.ok(!dadIsParent)

        await contractInstance.addParent(dad, {from: dad})

        const dadIsParent2 = await contractInstance.isParent(dad)
        assert.ok(dadIsParent2)

        const balance = await contractInstance.balanceOf(dad)
        assert.equal(balance, 0)

        const amount = Web3.utils.toWei('100', 'ether')

        await contractInstance.chargeCoins(amount, {from: dad})

        const balance2 = await contractInstance.balanceOf(dad)
        assert.equal(balance2, amount)
    })

    it("Kid test", async () => {
        await contractInstance.addParent(dad, {from: dad})
        await contractInstance.addParent(mom, {from: dad})

        const aliceIsKid = await contractInstance.isKid(alice)
        assert.ok(!aliceIsKid)

        await contractInstance.addKid(alice, {from: dad})
        await contractInstance.addKid(bob, {from: mom})

        const aliceIsKid2 = await contractInstance.isKid(alice)
        assert.ok(aliceIsKid2)

        const bobIsKid = await contractInstance.isKid(bob)
        assert.ok(bobIsKid)
    })

    it("Transfer test", async () => {
        // Set roles
        await contractInstance.addParent(dad, {from: dad})
        await contractInstance.addParent(mom, {from: dad})

        await contractInstance.addKid(alice, {from: dad})
        await contractInstance.addKid(bob, {from: mom})

        // Check zero balances of everyone
        assert.equal(
            await contractInstance.balanceOf(mom),
            0
        )
        assert.equal(
            await contractInstance.balanceOf(dad),
            0
        )
        assert.equal(
            await contractInstance.balanceOf(alice),
            0
        )
        assert.equal(
            await contractInstance.balanceOf(bob),
            0
        )

        // Change dad's wallet
        await contractInstance.chargeCoins(
            Web3.utils.toWei('100', 'ether'), 
            {from: dad}
        )

        assert.equal(
            await contractInstance.balanceOf(dad),
            Web3.utils.toWei('100', 'ether')
        )

        // Transfer dad -> mom
        await contractInstance.transfer(
            mom, 
            Web3.utils.toWei('80', 'ether'), 
            {from: dad}
        )

        assert.equal(
            await contractInstance.balanceOf(dad),
            Web3.utils.toWei('20', 'ether')
        )
        assert.equal(
            await contractInstance.balanceOf(mom),
            Web3.utils.toWei('80', 'ether')
        )

        // Transfer mom -> alice
        await contractInstance.transfer(
            alice, 
            Web3.utils.toWei('12', 'ether'), 
            {from: mom}
        )

        assert.equal(
            await contractInstance.balanceOf(mom),
            Web3.utils.toWei('68', 'ether')
        )
        assert.equal(
            await contractInstance.balanceOf(alice),
            Web3.utils.toWei('12', 'ether')
        )

        // Transfer alice -> bob
        await contractInstance.transfer(
            bob, 
            Web3.utils.toWei('7', 'ether'), 
            {from: alice}
        )

        assert.equal(
            await contractInstance.balanceOf(alice),
            Web3.utils.toWei('5', 'ether')
        )
        assert.equal(
            await contractInstance.balanceOf(bob),
            Web3.utils.toWei('7', 'ether')
        )

        // Transfer bob -> dad
        await contractInstance.transfer(
            dad, 
            Web3.utils.toWei('2', 'ether'), 
            {from: bob}
        )

        assert.equal(
            await contractInstance.balanceOf(bob),
            Web3.utils.toWei('5', 'ether')
        )
        assert.equal(
            await contractInstance.balanceOf(dad),
            Web3.utils.toWei('22', 'ether')
        )
    })
})
