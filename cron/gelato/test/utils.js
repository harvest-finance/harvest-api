
async function impersonates(targetAccounts){
    console.log("Impersonating...");
    for(i = 0; i < targetAccounts.length ; i++){
        console.log(targetAccounts[i]);
        await hre.network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [
            targetAccounts[i]
        ]
        });
    }
}

module.exports = { impersonates }