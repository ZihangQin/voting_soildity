pragma solidity ^0.8.19;

contract WeChatTransfer {
    // 定义一个结构体Transaction，包含两个属性：事件内容eventContent和数值amount
    struct Transaction {
        string eventContent;
        uint256 amount;
    }

    // 定义一个映射类型的变量transactions，将交易ID映射到Transaction结构体
    mapping(uint256 => Transaction) private transactions;

    // 定义两个私有变量transactionCount和balance，分别表示交易数量和合约余额
    uint256 private transactionCount;
    // uint256 private balance;

    // 定义两个事件类型TransactionCreated和TransactionDeleted，用于记录交易创建和删除的信息
    event TransactionCreated(string eventContent, uint256 amount);
    event TransactionDeleted(string eventContent, uint256 amount);

    // 定义函数createTransaction，用于创建交易并更新交易数量和合约余额
    function createTransaction(
        string memory _eventContent,
        uint256 _amount
    ) public {
        // 要求交易数量小于5，否则抛出异常
        require(
            transactionCount < 5,
            "Maximum number of transactions reached."
        );

        // 创建新的Transaction结构体，并将其添加到transactions映射中
        transactions[transactionCount] = Transaction(_eventContent, _amount);
        // 更新交易数量和合约余额
        transactionCount++;
        // balance += _amount;
        // 触发TransactionCreated事件，记录创建新交易的信息
        emit TransactionCreated(_eventContent, _amount);
    }

    // 定义函数getTransaction，根据给定的索引获取对应的交易信息
    function getTransaction(
        uint256 _index
    ) public view returns (string memory, uint256) {
        // 要求索引小于交易数量，否则抛出异常
        require(_index < transactionCount, "Invalid transaction index.");

        // 根据索引获取对应的Transaction结构体，并返回其中的eventContent和amount属性值
        Transaction storage transaction = transactions[_index];
        return (transaction.eventContent, transaction.amount);
    }

    // 定义函数getAllTransactions，获取所有已创建的交易信息
    function getAllTransactions() public view returns (Transaction[] memory) {
        // 创建一个长度为交易数量的Transaction数组allTransactions
        Transaction[] memory allTransactions = new Transaction[](
            transactionCount
        );

        // 遍历transactions映射，并将每一个Transaction结构体添加到allTransactions数组中
        for (uint256 i = 0; i < transactionCount; i++) {
            Transaction storage transaction = transactions[i];
            allTransactions[i] = transaction;
        }

        // 返回包含所有交易信息的Transaction数组
        return allTransactions;
    }

    // 定义函数deleteTransaction，根据给定的索引删除对应的交易并更新交易数量和合约余额
    function deleteTransaction(uint256 _index) public {
        // 要求索引小于交易数量，否则抛出异常
        require(_index < transactionCount, "Invalid transaction index.");

        // 获取要删除的交易及其金额，并更新合约余额
        Transaction storage transactionToDelete = transactions[_index];
        // balance -= transactionToDelete.amount;

        // 移动transactions映射中的元素以保持连续性
        for (uint256 i = _index; i < transactionCount - 1; i++) {
            transactions[i] = transactions[i + 1];
        }

        // 删除最后一个交易，并更新交易数量
        delete transactions[transactionCount - 1];
        transactionCount--;

        // 触发TransactionDeleted事件，记录删除交易的信息
        emit TransactionDeleted(
            transactionToDelete.eventContent,
            transactionToDelete.amount
        );
    }
}
