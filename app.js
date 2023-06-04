// 连接以太坊网络
const web3 = new Web3(Web3.givenProvider);

var _accounts = [];


// 得到当前用户地址
var address2 = new web3.eth.getAccounts().then(
	function (accounts) {
		_accounts = accounts;
		console.log("账户地址:", _accounts[0])
	}
);

// 加载智能合约
const contractAddress = "0x72557f58A99112C1457B06650F14C792b30F236E";
const contractABI = [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			}
		],
		"name": "addCandidate",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_addr",
				"type": "address"
			}
		],
		"name": "addHost",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "number",
				"type": "uint256"
			}
		],
		"name": "buyTickets",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "_hostAddress",
				"type": "address"
			}
		],
		"name": "hostAddedEvent",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_candidateIndex",
				"type": "uint256"
			}
		],
		"name": "vote",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "_candidateId",
				"type": "uint256"
			}
		],
		"name": "votedEvent",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "candidates",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "voteCount",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_index",
				"type": "uint256"
			}
		],
		"name": "getCandidateId",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_index",
				"type": "uint256"
			}
		],
		"name": "getCandidateName",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getCandidatesNum",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_index",
				"type": "uint256"
			}
		],
		"name": "getCandidateVotes",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "hosts",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_addr",
				"type": "address"
			}
		],
		"name": "isHost",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "voters",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];
const contract = new web3.eth.Contract(contractABI, contractAddress);

// 监听账号更改事件(更换账户时刷新页面)
if (typeof window.ethereum !== 'undefined') {
	window.ethereum.on('accountsChanged', function (accounts) {
		location.reload();
	});
}

// 进行投票
document.getElementById("voting_form").addEventListener("submit", async (event) => {//监听器，监听voting_form表单
	event.preventDefault();
	const candidateIndex = document.getElementById("candidateList").value;
	const accounts = await web3.eth.getAccounts();
	//先判断是否有投票权
	const v = await contract.methods.voters(_accounts[0]).call();
	if (!v) {
		contract.methods.vote(candidateIndex).send({ from: accounts[0] })
		.on('receipt', function (receipt) {
			console.log(receipt)
			alert("Voted successfully!")
			location.reload();
		})
	} else {
		alert("Please buy the ticket before voting or end voting!");
		location.reload();
	}
});

// 加载候选人列表和投票结果
window.addEventListener("load", async () => {//监听器，监听window整个窗口
	// 获取候选人数量
	const candidateCount = await contract.methods.getCandidatesNum().call();

	// 显示候选人列表和投票结果
	for (let i = 0; i < candidateCount; i++) {
		// 获取候选人信息
		const id = await contract.methods.getCandidateId(i).call();
		const name = await contract.methods.getCandidateName(i).call();
		const votes = await contract.methods.getCandidateVotes(i).call();

		// 显示候选人姓名和票数
		document.getElementById("candidateUl").innerHTML += `<li>${id}: ${name}: ${votes}</li>`;
		// 添加候选人到下拉框
		const opt = document.createElement("option");
		opt.value = i;
		opt.innerHTML = name;
		document.getElementById("candidateList").appendChild(opt);
	}
});

//添加候选人
document.getElementById("add_form").addEventListener("submit", async (event) => {
	event.preventDefault();
	const candidateIndex = document.getElementById("add-heading").value;
	const accounts = await web3.eth.getAccounts();

	if (candidateIndex === "") {
		alert("Please enter the candidate's name!")
		return;
	}

	const is_host = await contract.methods.isHost(_accounts[0]).call();
	if (is_host) {
		contract.methods.addCandidate(candidateIndex).send({
			from: accounts[0]
		}).on('receipt', function (receipt) {
			alert("Candidate added successfully!")
			location.reload();
		})
			.on('error', function (error, receipt) {
				console.log(error.outputs, receipt)
			})

	} else {
		alert("Please apply as the host first!")
	}

});

//添加主持人
document.getElementById("add_moderator").addEventListener("submit", async (event) => {
	event.preventDefault();

	//先判断是否是主持人
	const is_host = await contract.methods.isHost(_accounts[0]).call();
	var num = 10;
	if(!is_host){
		await contract.methods.addHost(_accounts[0]).send({ from: _accounts[0] })
		.on('receipt', function (receipt) {
			alert("Add moderator successfully!")
		})
	}else{
		alert("You are the host, please do not repeat application!")
	}
})

//通过点击显示输入交易数量
function showTicketForm() {
	document.getElementById("ticketForm").style.display = "block";
}

//通过点击取消显示交易数量
function hideTicketForm() {
	document.getElementById("ticketForm").style.display = "none";
}

//执行购买票卷方法
document.getElementById("but_ticket").addEventListener("submit", async (event) => {
	var qty = document.getElementById("ticketQty").value; // 获取输入数量并执行购买票据的操作
	if (qty === "") {
		alert("Please enter the amount!");
		return;
	}

	if (qty < 10) {
		alert("The input amount is too small to purchase the ticket!");
		return;
	}

	event.preventDefault();
	//判断是否有投票权
	const v = await contract.methods.voters(_accounts[0]).call();
	if (v) {
		await contract.methods.buyTickets(qty).send({ from: _accounts[0] })
			.on('receipt', function (receipt) {
				alert("Purchase success, can re-vote!")
				location.reload();
			})
	} else {
		alert("you already have a ticket, please vote first and then buy it. No more than one ticket will be held by each person at ！！！！");
		location.reload();
	}




})


