import {useState} from 'react';
import { useAccount, useConnect, useDisconnect, useWriteContract, useReadContract} from 'wagmi'
import ContractABI from "./abi/contract.json";
import TokenABI from "./abi/erc20.json";
import { ethers } from 'ethers';

const CONTRACT_ADDRESS  = "0x604bd488ba1190f6Cd447AB681881ce7092412D3";
const TOKEN_ADDRESS = "0x8d008B313C1d6C7fE2982F62d32Da7507cF43551";
const decimal =  1000000000000000000;

function App() {
  const [amount, setAmount] = useState("");
  const {isConnected, address} = useAccount()
  const { connectors, connect} = useConnect()
  const { disconnect } = useDisconnect();
  const {writeContract } = useWriteContract()
  const metaMaskConnector = connectors.find((connector) => connector.id === 'injected');

  const allowance =  useReadContract({
	address: TOKEN_ADDRESS,
	abi: TokenABI,
	functionName: "allowance",
	args: [address, CONTRACT_ADDRESS],
  });
  console.log(allowance)

  const {data: contractBalance} = useReadContract({
	address: TOKEN_ADDRESS, 
	abi: TokenABI,         
	functionName: 'balanceOf', 
	args: [CONTRACT_ADDRESS]
  });

  const {data: reward} = useReadContract({
	address: CONTRACT_ADDRESS, 
	abi: ContractABI,         
	functionName: 'rewardedBeans', 
	args: [address]
  });

  const {data:userData} =  useReadContract({
	address: CONTRACT_ADDRESS, 
	abi: ContractABI,         
	functionName: 'user', 
	args: [address]
  });
  console.log(userData,"userdata")

  const {data: passedTime} =  useReadContract({
	address: CONTRACT_ADDRESS, 
	abi: ContractABI,         
	functionName: 'secondsSinceLastEat', 
	args: [address]
  });



  const handleBuy = async () => {
	if (!isConnected) {
	  alert("Please connect your wallet first.");
	  return;
	}
	if (!amount || parseFloat(amount) <= 0) {
	  alert("Please enter a valid amount.");
	  return;
	}
	const depositAmount = ethers.parseUnits(amount, 18);
	try {
		const approveTx = await writeContract({
		  address: TOKEN_ADDRESS,
		  abi: TokenABI,
		  functionName: "approve",
		  args: [CONTRACT_ADDRESS, depositAmount],
		});

		const buyTx = await writeContract({
			address: CONTRACT_ADDRESS,
			abi: ContractABI,
			functionName: "buyBeans",
			args: [address, depositAmount],
		});
		console.log(approveTx, buyTx)
	} catch (error) {
	  console.error("Error during transaction:", error);
	  alert("Transaction failed. Check the console for details.");
	}
  };


  const handleBake = async () => {
	const rebakeTx = await writeContract({
		address: CONTRACT_ADDRESS,
		abi: ContractABI,
		functionName: "bake",
		args: [],
	});
	console.log(rebakeTx,"*************");
  }


  const handleEat = async () => {
	const eatTx = await writeContract({
		address: CONTRACT_ADDRESS,
		abi: ContractABI,
		functionName: "eat",
		args: [],
	});
	console.log(eatTx,"*************");
  }
console.log
//   let bakedAt = userData?.bakedAt;

  return (
    <>
      <div className="font-bold">
        <nav className="flex items-center justify-between flex-wrap p-6 header px-8">
          <div className="flex items-center flex-shrink-0 text-white mr-6">
          <img src="/asset/images/ape3.a594fade.png" className='h-[60px] w-[60px]'/>
          </div> 
          <div className='text-white flex gap-2'>
            {isConnected && <img src="/asset/images/opbnb.png" className='w-[40px] h-[40px]'></img>}
          <div className='items-center bg-footer rounded-2xl font-bold cursor-pointer py-2 px-3 text-lg text-ellipsis overflow-hidden w-[100px]'>
            {isConnected ? (
                <button
                  type="button"
                  onClick={() => disconnect()}
                  className="text-eclipse overflow-hidden"
                >
                  {`${address?.slice(0, 6)}...${address?.slice(-4)}`}
                </button>
                ) : metaMaskConnector ? (
                  <button
                    type="button"
                    onClick={() => connect({ connector: metaMaskConnector })}
                  >
                    Connect
                  </button>
                ) : null}
              </div>
            </div>
        </nav>
		<div className="main w-full px-4 py-4 sm:px-0 sm:py-12 flex justify-center items-center flex-col gap-24">
		  <div className="max-w-600 flex flex-col justify-center items-center p-2 md:p-4 text-center top">
			<div className="m-2 md:m-6">
			  <img src="/asset/images/1.png" alt="mid" height="70" width="350" className="rounded-md rounded-xl mx-auto d-block mb-4" />
			  <h4 className="text-xl md:text-2xl font-bold p-4">OP Dollar Beans is a USDT static rewards pool returning up to 6.5% daily</h4>
			  <div className="flex flex-row justify-between text-md md:text-lg ">
				<p>Contract Balance</p>
				<p>{contractBalance? (Number(contractBalance) / decimal).toFixed(3): "0.00"} USDT</p>
			  </div>
			  <div className="flex flex-row justify-between text-md md:text-lg my-6">
				<p>Your USDT invested</p>
				{/* <p>{userData? Number(userData?.totalDeposit)/decimal: 0} USDT</p> */}
				{/* <p>{userData? Number(userData?.totalDeposit)/decimal: 0} USDT</p> */}
			  </div>
			  <div className="flex flex-col">
				<p className="text-left">Your Beans</p>
				<div className="bg-34344A rounded-2xl p-4 md:p-6 text-2xl border border-gray-900 hover:border-41444F  flex justify-between mt-6">
				  <input
            type = "text" 
				  		id="bnbval"
						className="bg-transparent placeholder:text-B2B9D2 outline-none  w-full text-lg md:text-2xl" 
						placeholder="0.0" pattern="^[0-9]*[.,]?[0-9]*$" 
						value={amount}
            onChange={(e) => setAmount(e.target.value)}
					/>
				  <span className="coin text-lg md:text-2xl">USDT</span>
				</div>
				<div className="flex justify-between text-md md:text-lg">
				  <span>Min - 5 USDT</span>
				  <span>Max - 10000 USDT</span>
				</div>
				<button type="submit" className="but mt-6 mb-12 mx-4 p-4 hover:text-gray-700 hover:border-0" onClick={handleBuy}>
          <p className="text-md md:text-xl font-bold">Buy Beans</p>
        </button>
				<div className="divider py-1"></div>
				<div className="flex justify-between my-6 text-lg md:text-lg">
				  <span>Your Bean Rewards</span>
				  <span>{reward? Number(reward)/decimal:0} USDT</span>
				</div>
				<div className="flex flex-col sm:flex-row gap-8 sm:gap-0 justify-center items-center">
				  <div className="w-full sm:w-1/2">
					<button className="but px-6 font-bold hover:text-gray-700" onClick={handleBake}>ReBake Beans</button>
				  </div>
				  <div className="w-full sm:w-1/2">
					<button className="but font-bold hover:text-gray-700" onClick={handleEat}>Eat Beans</button>
				  </div>
				</div>
				<div className="flex justify-between my-12 text-lg md:text-lg">
				  <span>Time passed since last eat</span>
				  <span>{Number(passedTime)}d hr min</span>
				</div>
			  </div>
			</div>
		  </div>
  
		  <div className="max-w-600 flex flex-col justify-center items-center p-2 md:p-4 text-center top">
			<div className="m-2 md:m-6">
			  <p className="text-left">Details</p>
			  <div className="divider py-1"></div>
			  <div className="flex justify-between my-6 text-lg md:text-lg">
				<span>Daily Returns upto*</span>
				<span>3.5 - 6.5%</span>
			  </div>
			  <div className="flex justify-between my-6 text-lg md:text-lg">
				<span>APR up to</span>
				<span>1278% - 2373%</span>
			  </div>
			  <div className="flex justify-between mt-6 text-lg md:text-lg">
				<span>Fees</span>
				<span>2% Deposit</span>
			  </div>
			  <p className="text-right">5% Withdraw</p>
			  <div className="text-left text-md md:text-lg mb-12">
				<p className="mt-12 mb-18">
				  OP Dollar Beans is a decentralized application (dApp) that allows users to invest in a rewards pool using USDT (opBNB). The dApp has three main functions: Buy Beans (Invest), Rebake Beans (Compound), and Eat Beans (Withdraw). There is a tax on early withdrawals, with the amount depending on how long the USDT has been in the pool (the longer it has been, the lower the tax). Referral codes can be used to receive a 5% bonus on deposits made by people you refer. There are also 'Beantastic' referrals, which give higher daily returns depending on the number you have. The minimum investment is 10 USDT and the maximum is 10,000 USDT. There is a 2% deposit fee and a 5% withdrawal fee back to contract. The contract is fully decentralized, audited, and cannot be changed. Check the whitepaper for more details.
				</p>
			  </div>
			</div>
		  </div>
  
		  <div className="max-w-600 w-full flex flex-col justify-center items-center p-2 md:p-4 text-center top">
			<div className=" p-8 w-full mb-24">
			  <div className="mx-2 mt-8"><input type="text" className="form-control " value={address? address: "undefined"} disabled/></div>
			  <div className="bg-34344A my-3 rounded-2xl p-6 text-gray-100  border border-34344A hover:border-41444F  flex justify-between items-center my-4 mx-2">
				Referrals<span className="coin1"></span>
			  </div>
			  <p className="text-lg md:text-xl">
				Earn 5% of the downline USDT deposit.
			  </p>
			</div>
		  </div>
		</div>
  
		<div className="w-full flex justify-center bg-footer p-2">
			<div className="flex flex-row justify-center rounded-full gap-4 py-2 px-4 bg-191B1F">
				<a href="/" className="rounded">
				  <img src = "/asset/images/tg.png" width={40} height={40} className='rounded-xl'/>
				</a>
				<a href="https://testnet.bscscan.com/address/0x604bd488ba1190f6Cd447AB681881ce7092412D3" className="rounded">
				  <img src = "/asset/images/etherscan.png" width={40} height={40}  />
				</a>
				<a href="/" className="rounded">
				  <img src = "/asset/images/pdf.png" width={40} height={40} />
				</a>
				<a href="/" className="rounded">
				  <img src = "/asset/images/home.png" width={40} height={40} className='rounded-xl'/>
				</a>
			</div>
		</div>
	  </div>
    </>
  )
}

export default App
