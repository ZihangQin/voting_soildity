pragma solidity ^0.8.0;

contract votes {
  // 候选人结构体
  struct Candidate {
    uint id;
    string name;
    uint voteCount;
  }

  // 存储所有候选人信息的数组
  Candidate[] public candidates;

  // 存储每个地址对应的投票人的投票状态（是否已投票）
  mapping(address => bool) public voters;

  // 存储主持人地址列表的mapping
    address[] public hosts;

  // 投票事件
  event votedEvent (
    uint indexed _candidateId
  );

  // 新增主持人事件
  event hostAddedEvent (
    address indexed _hostAddress
  );

  // 向候选人数组中添加候选人
  function addCandidate(string memory _name) public {
    candidates.push(Candidate(candidates.length + 1, _name, 0));
  }

  // 添加主持人
  function addHost(address _addr) public {
    hosts.push(_addr);
    emit hostAddedEvent(_addr);
  }

  // 构造函数，初始化候选人数组
  constructor() {
    addCandidate("Alice");
    addCandidate("Bob");
    addCandidate("Charlie");
    
    hosts.push(0x581373f81531a52E1bd2aC75a3321b97B088bD52);
  }

  // 投票函数，接受候选人 ID 作为参数
  function vote(uint _candidateIndex) public {
    // 确保投票人未投过票
    require(!voters[msg.sender],"You have already voted!");
    // 确保候选人 ID 存在
    require(_candidateIndex >= 0 && _candidateIndex <= candidates.length,"Invalid candidate ID!");
    // 标记投票人已投票
    voters[msg.sender] = true;

    // 更新候选人的得票数
    candidates[_candidateIndex].voteCount++;

    // 触发投票事件
    emit votedEvent(_candidateIndex);
  } 
  
 
  // 购买票券  
  function buyTickets(uint number) public {
      require(voters[msg.sender], "Please vote before you buy your ticket");
      require(number <= 10, "The eth paid is less than 10");
      voters[msg.sender] = false;
  }
  
  function getCandidateName(uint _index) public view returns (string memory) {
        require(_index < candidates.length, "Candidate with the given index does not exist.");
        return candidates[_index].name;
    }

  function getCandidateVotes(uint _index) public view returns (uint) {
        require(_index < candidates.length, "Candidate with the given index does not exist.");
        return candidates[_index].voteCount;
    }
    
  function getCandidateId(uint _index) public view returns (uint) {
        require(_index < candidates.length, "Candidate with the given index does not exist.");
        return candidates[_index].id;
    }

  function getCandidatesNum() public view returns(uint){
        return candidates.length;
    }
    
  // 是否是住处主持人 
  function isHost(address _addr) public view returns(bool){
          for(uint i = 0; i < hosts.length; i++) {
        if(hosts[i] == _addr) {
            return true;
        }
    }
    return false;
    }
}
