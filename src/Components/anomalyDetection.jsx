import React, { useEffect, useState } from "react";
import { FaExclamationTriangle, FaCheckCircle, FaSearch } from "react-icons/fa";
import { FaFlag } from "react-icons/fa";
import { FaRedo } from "react-icons/fa";
import { MdBlock } from "react-icons/md";
import DataTable from 'react-data-table-component';
import { useSocket } from "../context/SocketContext"
import { toast } from "react-toastify"

function AnomalyDetection({userData}) {
    const [inflowSearchText, setInflowSearchText] = useState('');
    const [outflowSearchText, setOutflowSearchText] = useState('');
    const [unusualActivitySearchText, setUnusualActivitySearchText] = useState('');
    const [dataDuplicationSearchText, setDataDuplicationSearchText] = useState('');
    const [budgetDuplicationSearchText, setBudgetDuplicationSearchText] = useState('');
    const [purchaseOrderDuplicationSearchText, setPurchaseOrderDuplicationSearchText] = useState('');
    const [inflowDuplicationSearchText, setInflowDuplicationSearchText] = useState('');
    const [outflowDuplicationSearchText, setOutflowDuplicationSearchText] = useState('');
    const [failedLoginAttemptsSearchText, setFailedLoginAttemptsSearchText] = useState('');
    const [flaggedAnomalySearchText, setFlaggedAnomalySearchText] = useState ('');
    const [selectedBudgetRow, setSelectedBudgetRow] = useState(null);
    const [selectedPurchaseRow, setSelectedPurchaseRow] = useState(null);
    const [selectedInflowRow, setSelectedInflowRow] = useState(null);
    const [selectedOutflowRow, setSelectedOutflowRow] = useState(null);
    const [selectedInflowTransaction, setSelectedInflowTransaction] = useState(null);
    const [selectedOutflowTransaction, setSelectedOutflowTransaction] = useState(null);
    const [selectedUnusualActivity, setSelectedUnusualActivity] = useState(null);
    const [selectedFailedLoginAttempt, setSelectedFailedLoginAttempt] = useState(null);
    const [selectedFlaggedAnomaly, setSelectedFlaggedAnomaly] = useState(null);
    const [password, setPassword] = useState("");
    const [description, setDescription] = useState('')
    const [selectedRowData, setSelectedRowData] = useState([])
    const [errorVerification, setErrorVerification] = useState('')

    // TABLE DATA
    const [inflowTransactionData, setInflowTransactionData] = useState([]);
    const [outflowTransactionData, setOutflowTransactionData] = useState([]);
    const [budgetDuplicationData, setBudgetDuplicationData] = useState([]);
    const [purchaseOrderDuplicationData, setPurchaseOrderDuplicationData] = useState([])
    const [inflowDuplicationData, setInflowDuplicationData] = useState([])
    const [outflowDupulicationData, setOutflowDuplicationData] = useState([])
    const [unusualActivityData, setUnusualActivityData] = useState([])
    const [failedLoginAttemptsData, setFailedLoginAttemptsData] = useState([])
    const [flaggedAnomalyData, setFlaggedAnomalyData] = useState([])

    // FOR LOADERS
    const [isLoadingPOT, setIsLoadingPOT] = useState(true);
    const [isLoadingPIT, setIsLoadingPIT] = useState(true);
    const [isLoadingBRD, setIsLoadingBRD] = useState(true)
    const [isLoadingPOD, setIsLoadingPOD] = useState(true)
    const [isLoadingID, setIsLoadingID] = useState(true)
    const [isLoadingOD, setIsLoadingOD] = useState(true)
    const [isLoadingSL, setIsLoadingSL] = useState(true)
    const [isLoadingFLA, setIsLoadingFLA] = useState(true)
    const [isSubmitLoading, setIsSubmitLoading] = useState(true)
    

    const formatCurrency = (value) => {
        if (value === undefined || value === null) {
            return `₱0.00`;
        }
        return `₱${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
    };

    //SOCKET CONNECTION
    const socket = useSocket()

    // FETCH ANOMALY DATA
    useEffect(() => {
      if(!socket) return

      socket.emit('get_possible_outflow_anomaly')
      socket.emit('get_possible_inflow_anomaly')
      socket.emit('get_budget_req_duplication')
      socket.emit('get_po_duplication')
      socket.emit('get_inflow_duplication')
      socket.emit('get_outflow_duplication')
      socket.emit('get_suspicious_login')
      socket.emit('get_failed_attempt')
      socket.emit('get_resolved_anomalies')
      
      // GET POSSIBLE OUTFLOW ANOMALY
      const handlePossibleOutflowAnomaly = (response) => {
        setOutflowTransactionData(response)
        setIsLoadingPOT(false)
      }

      // GET POSSIBLE INFLOW ANOMALY
      const handlePossibleInflowAnomaly = (response) => {
        setInflowTransactionData(response)
        setIsLoadingPIT(false)
      }

      // GET BUDGET REQUEST DUPLICATION
      const handleBudgetReqDuplication = async (response) => {
        const data = response.map((item) => ({
          requestId: item._id.requestId,
          department: item._id.department,
          category: item._id.category,
          totalRequest: item._id.totalRequest,
          count: item.count,
          budgetReqId: item.budgetReqId
        }))
        setBudgetDuplicationData(data)
        setIsLoadingBRD(false)
      }
      
      // GET PURCHASE ORDER DUPLICATION
      const handlePurchaseOrderDuplication = async (response) => {
        const data = response.map((item) => ({
          orderNumber: item._id.orderNumber,
          customerName: item._id.customerName,
          totalAmount: item._id.totalAmount,
          count: item.count,
          poId: item.poId
        }))
        setPurchaseOrderDuplicationData(data)
        setIsLoadingPOD(false)
      }

      // GET INFLOW TRANSACTION DUPLICATION
      const handleInflowDuplication = async (response) => {
        const data = response.map((item) => ({
          auditorId: item._id.auditorId,
          auditor: item._id.auditor,
          invoiceId: item._id.invoiceId,
          totalAmount: item._id.totalAmount,
          count: item.count,
          inflowId: item.inflowId
        }))
        setInflowDuplicationData(data)
        setIsLoadingID(false)
      }

      // GET OUTFLOW TRANSACTION DUPLICATION
      const handleOutflowDuplication = async (response) => {
        const data = response.map((item) => ({
          approverId: item._id.approverId,
          approver: item._id.approver,
          payableId: item._id.payableId,
          totalAmount: item._id.totalAmount,
          count: item.count,
          outflowId: item.outflowId
        }))
        setOutflowDuplicationData(data)
        setIsLoadingOD(false)
      }
      
      // GET SUSPICIOUS LOGIN
      const handleSuspiciousLogin = async  (response) => {
        const data = response.map((item) => ({
          userId: item._id.userId,
          username: item._id.username,
          role: item._id.role,
          count: item.count,
          ipAddress: item.ipAddress,
          deviceInfo: item.deviceInfo,
          location: item.location,
          socketId: item.socketId
        }))
        setUnusualActivityData(data)
        setIsLoadingSL(false)

      }

      // GET FAILED ATTEMPT LOGIN
      const handleFailedAttemptLogin = async (response) => {
        setFailedLoginAttemptsData(response)
        setIsLoadingFLA(false)
      }

      // GET RESOLVED ANOMALIES
      const getResolvedAnomalies = (response) => {
        setFlaggedAnomalyData(response)
      }

      // RESPONSE FROM NEW INVESTIGATE
      const handleNewInvestigate = (response) => {
        toast.success('The data is now on investigation', {
          position: "top-right"
        })
      }

      // ERROR ON SETTING ON INVESTIGATION
      const handleErrorInvestigation = (response) => {
        toast.error(response.msg, {
          position: "top-right"
        })
      }

      // BLOCK IP ADDRESS FROM FAL SUCCESS
      const handleBlockIp = (response) => {
        setIsSubmitLoading(true)
        setPassword('')
        document.getElementById("block_modal").close();
        document.getElementById("failed_login_attempt_modal").close();
        toast.success(response.msg, {
          position: "top-right"
        })
      }

      // BLOCK IP ADDRESS FROM FAL ERROR
      const handleBlockIpError = (response) => {
        setIsSubmitLoading(true)
        setPassword('')
        document.getElementById("block_modal").close();
        document.getElementById("failed_login_attempt_modal").close();
        toast.error('Server Internal Error', {
          position: "top-right"
        })
      }

      // HANDLE ERROR VERIFICATION
      const handleErrorVerification = (response) => {
        setIsSubmitLoading(true)
        setPassword('')
        setErrorVerification(response.msg)
      }

      socket.on('error_verification', handleErrorVerification)
      socket.on('block_ip_FAL_success', handleBlockIp)
      socket.on('block_ip_FAL_error', handleBlockIpError)
      socket.on('new_investigate_error', handleErrorInvestigation)
      socket.on('receive_new_investigate', handleNewInvestigate)
      socket.on('receive_resolved_anomalies', getResolvedAnomalies)
      socket.on('receive_failed_attempt', handleFailedAttemptLogin)
      socket.on('receive_suspicious_login', handleSuspiciousLogin)
      socket.on('receive_outflow_duplication', handleOutflowDuplication)
      socket.on('receive_inflow_duplication', handleInflowDuplication)
      socket.on('receive_po_duplicaiton', handlePurchaseOrderDuplication)
      socket.on('receive_budget_req_duplication', handleBudgetReqDuplication)
      socket.on('receive_possible_outflow_anomaly', handlePossibleOutflowAnomaly)
      socket.on('receive_possible_inflow_anomaly', handlePossibleInflowAnomaly)

      return () => {
        socket.off('receive_possible_outflow_anomaly')
        socket.off('receive_possible_inflow_anomaly')
        socket.off('receive_po_duplicaiton')
        socket.off('receive_budget_req_duplication')
        socket.off('receive_inflow_duplication')
        socket.off('receive_suspicious_login')
        socket.off('receive_failed_attempt')
        socket.off('receive_resolved_anomalies')
        socket.off('receive_new_investigate')
        socket.off('new_investigate_error')
        socket.off('error_verification')
        socket.off('block_ip_FAL_success')
        socket.off('block_ip_FAL_error')
      }

    },[socket])


  // HANDLE BLOCK USER FROM FAILED ATTEMPTS LOGS
  const handleBlockUser = (e) => {
    e.preventDefault()
    setIsSubmitLoading(false)
    socket.emit('block_ip_FAL', { row: selectedRowData, userName: userData.userName, password})
};

  const handleReloadInflowP = () => {
    setInflowSearchText("");
    setIsLoadingPIT(true)
    socket.emit('get_possible_inflow_anomaly', {msg: 'get possible anomaly'})
  };

  const handleReloadOutflowP = () => {
    setInflowSearchText("");
    setIsLoadingPOT(true)
    socket.emit('get_possible_outflow_anomaly', {msg: 'get possible anomaly'})
  };


    const inflowTransactionsColumns = [
      { name: 'ID', selector: row => row.id },
      { name: 'Date & Time', selector: row => row.dateTime },
      { name: 'Auditor ID', selector: row => row.auditorId },
      { name: 'Auditor', selector: row => row.auditor },
      { name: 'P.O ID', selector: row => row.invoiceId },
      { name: 'Customer Name', selector: row => row.customerName },
      { name: 'Total Amount', selector: row => formatCurrency(row.totalAmount) },
  ];

  const outflowTransactionsColumns = [
    { name: 'ID', selector: row => row.id },
    { name: 'Date & Time', selector: row => row.dateTime },
    { name: 'Approver ID', selector: row => row.approverId },
    { name: 'Approver', selector: row => row.approver },
    { name: 'Payable ID', selector: row => row.payableId },
    { name: 'Category', selector: row => row.category },
    { name: 'Department', selector: row => row.department },
    { name: 'Total Amount', selector: row => formatCurrency(row.totalAmount) },

];


  const failedAttemptsColumns = [
    { name: 'ID', selector: row => row._id },
    { name: 'User ID', selector: row => row.userId },
    { name: 'IP Address', selector: row => row.ipAddress },
    { name: 'Attempts', selector: row => row.attempts },
    { name: 'Date', selector: row => row.attemptDate },
    {
        name: 'Action', 
        cell: (row) => (
            <button 
            onClick={() => {
              document.getElementById("block_modal").showModal();
              setSelectedRowData(row);  
          }}
                
                className="btn btn-outline hover:bg-white hover:text-black text-white mt-2 mb-2"
                
            >
                Block
            </button>
        ),
        ignoreRowClick: true,
        allowOverflow: true,
        button: true,
    }
];

const budgetDuplicationColumns = [
  { name: 'Count', selector: row => row.count , width: '80px'},
  { name: 'Request ID', selector: row => row.requestId, width: '200px' },
  { name: 'Category', selector: row => row.category, width: '180px' },
  { name: 'Department', selector: row => row.department },
  { name: 'Budget Request ID', selector: row => (
    <ul>
      {row.budgetReqId.map((item, index) => (
        <li key={index}>[{item}]</li>
      ))}
    </ul>
  ), width: '200px'},
  { name: 'Total Request', selector: row => formatCurrency(row.totalRequest) },
];

const purchaseOrderDuplicationColumns = [
  { name: 'Count', selector: row => row.count, width: '80px'},
  { name: 'Order Number', selector: row => row.orderNumber, width: '200px' },
  { name: 'Customer Name', selector: row => row.customerName, width: '150px' },
  { name: 'P.O ID', selector: row => ( 
    <ul>
      {row.poId.map((item, index) => (
        <li key={index}>[{item}]</li>
      ))}
    </ul>), width: '200px' 
  },
  { name: 'Total Amount', selector: row => formatCurrency(row.totalAmount) },
];

const inflowDuplicationColumns = [
  { name: 'Count', selector: row => row.count, width: '80px'},
  { name: 'Auditor ID', selector: row => row.auditorId, width: '200px' },
  { name: 'Auditor', selector: row => row.auditor, width: '100px' },
  { name: 'Invoice ID', selector: row => row.invoiceId, width: '200px' },
  { name: 'Inflow ID', selector: row => ( 
    <ul>
      {row.inflowId.map((item, index) => (
        <li key={index}>[{item}]</li>
      ))}
    </ul>), width: '200px' },
  { name: 'Total Amount', selector: row => formatCurrency(row.totalAmount )},
];

const outflowDuplicationColumns = [
  { name: 'Count', selector: row => row.count, width: '80px'},
  { name: 'Approver ID', selector: row => row.approverId, width: '200px' },
  { name: 'Approver', selector: row => row.approver },
  { name: 'Payable ID', selector: row => row.payableId, width: '200px' },
  { name: 'Outflow ID', selector: row => ( 
    <ul>
      {row.outflowId.map((item, index) => (
        <li key={index}>[{item}]</li>
      ))}
    </ul>), width: '200px'
  },
  { name: 'Total Amount', selector: row => formatCurrency(row.totalAmount) },
];

const unusualActivityColumns = [
  { name: 'IP Address', selector: row => ( 
    <ul>
      {row.ipAddress.map((item, index) => (
        <li key={index}>[{item}]</li>
      ))}
    </ul>) },
  { name: 'Device Info', selector: row => ( 
  <ul>
    {row.deviceInfo.map((item, index) => (
      <li key={index}>[{item}]</li>
    ))}
  </ul>) },
  { name: 'Location', selector: row => ( 
    <ul>
      {row.location.map((item, index) => (
        <li key={index}>[{item}]</li>
      ))}
    </ul>) },
  { name: 'Socket ID', selector: row => ( 
    <ul>
      {row.socketId.map((item, index) => (
        <li key={index}>[{item}]</li>
      ))}
    </ul>) },
  { name: 'Staff ID', selector: row => row.userId },
  { name: 'Username', selector: row => row.username },
  { name: 'Role', selector: row => row.role },
];

const flaggedAnomalyColumns = [
  { name: 'ID', selector: row => row._id },
  { name: 'Anomaly Type', selector: row => row.anomalyType },
  { name: 'Anomaly From', selector: row => row.anomalyFrom },
  { name: 'Data ID', selector: row => row.dataId},
  { name: 'Description', selector: row => row.description},
  { name: 'Investigate By', selector: row => row.investigateBy},
  { name: 'Investigate Date', selector: row => row.investigateDate },
  { name: 'Resolved By', selector: row => row.resolvedBy},
  { name: 'Resolved Date', selector: row => row.resolvedDate},
  { name: 'Resolution Action', selector: row => row.resolutionAction},
  { name: 'Status', selector: row => row.status },
];


    const totalFlaggedAnomalies = 0;
    const totalAnomaliesResolved = 0;
    const totalOnInvestigation = 0;

    const handleDescriptionChange = (event) => {
      setDescription(event.target.value); 
    };

    const handleInflowSearch = (event) => {
        setInflowSearchText(event.target.value);
    };

    const handleOutflowSearch = (event) => {
        setOutflowSearchText(event.target.value);
    };

    const handleBudgetDuplicationSearch = (event) => {
      setBudgetDuplicationSearchText(event.target.value);
  };

  const handlePurchaseOrderDuuplicationSearch = (event) => {
    setPurchaseOrderDuplicationSearchText(event.target.value);
};

const handleInflowDuplicationSearch = (event) => {
  setInflowDuplicationSearchText(event.target.value);
};

const handleOutflowDuplicationSearch = (event) => {
  setOutflowDuplicationSearchText(event.target.value);
};

    const handleUnusualActivitySearch = (event) => {
      setUnusualActivitySearchText(event.target.value);
  };

  const handleDataDuplicationSearch = (event) => {
    setDataDuplicationSearchText(event.target.value);
};
const handleFailedLoginAttemptsSearch = (event) => {
  setFailedLoginAttemptsSearchText(event.target.value);
};

const handleFlaggedAnomalySearch = (event) => {
  setFlaggedAnomalySearchText(event.target.value);
};

const handleBudgetRowClick = (row) => {
  setSelectedBudgetRow(row);
  document.getElementById("budget_modal").showModal();
};

const handlePurchaseRowClick = (row) => {
  setSelectedPurchaseRow(row);
  document.getElementById("purchase_modal").showModal();
};

const handleInflowRowClick = (row) => {
  setSelectedInflowRow(row);
  document.getElementById("inflow_modal").showModal();
};

const handleOutflowRowClick = (row) => {
  setSelectedOutflowRow(row);
  document.getElementById("outflow_modal").showModal();
};

const handleInflowTransactionClick = (row) => {
  setSelectedInflowTransaction(row);
  document.getElementById("inflow_transaction_modal").showModal();
};

const handleOutflowTransactionClick = (row) => {
  setSelectedOutflowTransaction(row);
  document.getElementById("outflow_transaction_modal").showModal();
};

const handleUnusualActivityClick = (row) => {
  setSelectedUnusualActivity(row);
  document.getElementById("unusual_activity_modal").showModal();
};

const handleFailedLoginAttemptClick = (row) => {
  setSelectedRowData(row);
  document.getElementById("failed_login_attempt_modal").showModal();
};

const handleFlaggedAnomalyClick = (row) => {
  setSelectedFlaggedAnomaly(row);
  document.getElementById("flagged_anomaly_modal").showModal();
};

    const filteredInflowTransactionData = inflowTransactionData.filter(row =>
        Object.values(row).some(value =>
            value.toString().toLowerCase().includes(inflowSearchText.toLowerCase())
        )
    );

    const filteredOutflowTransactionData = outflowTransactionData.filter(row =>
        Object.values(row).some(value =>
            value.toString().toLowerCase().includes(outflowSearchText.toLowerCase())
        )
    );
    const filteredBudgetDuplicationData = budgetDuplicationData.filter(row =>
      Object.values(row).some(value =>
          value.toString().toLowerCase().includes(budgetDuplicationSearchText.toLowerCase())
      )
  );

  const filteredPurchaseOrderDuplicationData = purchaseOrderDuplicationData.filter(row =>
    Object.values(row).some(value =>
        value.toString().toLowerCase().includes(purchaseOrderDuplicationSearchText.toLowerCase())
    )
);

const filteredInflowDuplicationData = inflowDuplicationData.filter(row =>
  Object.values(row).some(value =>
      value.toString().toLowerCase().includes(purchaseOrderDuplicationSearchText.toLowerCase())
  )
);

const filteredOutflowDuplicationData = outflowDupulicationData.filter(row =>
  Object.values(row).some(value =>
      value.toString().toLowerCase().includes(outflowDuplicationSearchText.toLowerCase())
  )
);

    const filteredUnusualActivityData = unusualActivityData.filter(row =>
      Object.values(row).some(value =>
          value.toString().toLowerCase().includes(unusualActivitySearchText.toLowerCase())
      )
  );
    const filteredFailedLoginAttemptsData = failedLoginAttemptsData.filter(row =>
        Object.values(row).some(value =>
            value.toString().toLowerCase().includes(failedLoginAttemptsSearchText.toLowerCase())
        )
    );

    const filteredFlaggedAnomalyData = flaggedAnomalyData.filter(row =>
      Object.values(row).some(value =>
          value.toString().toLowerCase().includes(flaggedAnomalySearchText.toLowerCase())
      )
  );
    const customStyles = {
      headRow: {
        style: {
          backgroundColor: 'rgba(0, 85, 170, 0.85)', 
          color: 'white',
        },
      },
      title: {
        style: {
          color: 'white',
          fontSize: '18px',
          padding: '10px',
          textAlign: 'center',
        },
      },
      rows: {
        style: {
          backgroundColor: 'rgba(200, 50, 50, 0.90)', 
          color: 'white', 
        },
      },
    };
    
    // HANDLE OUTFLOW TO INVESTIGATE
    const handleInvestigateOutflow = () => {
      const data = {
        anomalyType: "Data Discrepancy",
        dataId: selectedOutflowTransaction.id,
        anomalyFrom: 'Outflow Transactions Data',
        description: `${selectedOutflowTransaction.approver} approves a budget to ${selectedOutflowTransaction.department} department with unusual total amount of ₱${selectedOutflowTransaction.totalAmount}`,
        investigateBy: userData.userName,
        investigateDate: Date.now(),
        status: 'On investigation'
      }
      document.getElementById("outflow_transaction_modal").close();
      socket.emit('investigate_anomaly', data)
    }

    // HANDLE INFLOW TO INVESTIGATE
    const handleInvestigateInflow = () => {
      const data = {
        anomalyType: "Data Discrepancy",
        dataId: selectedInflowTransaction.id,
        anomalyFrom: 'Inflow Transactions Data',
        description: `${selectedInflowTransaction.auditor} audits a money from a purchase order (P.O ID :${selectedInflowTransaction.invoiceId}) with unusual total amount of ₱${selectedInflowTransaction.totalAmount}`,
        investigateBy: userData.userName,
        investigateDate: Date.now(),
        status: 'On investigation'
      }
      document.getElementById("inflow_transaction_modal").close();
      socket.emit('investigate_anomaly', data)
    }

    // HANDLE BUDGET DUPLICATION TO INVESTIGATE
      const handleInvestigateBudgetDupli = () => {
        const data = {
          anomalyType: "Data Duplication",
          dataId: selectedBudgetRow.requestId,
          anomalyFrom: 'Budget Request Data',
          description: `Duplicated data request from ${selectedBudgetRow.department}. Budget Request ID: [${selectedBudgetRow.budgetReqId.map(data => `${data}`).join(', ')}]`,
          investigateBy: userData.userName,
          investigateDate: Date.now(),
          status: 'On investigation'
        }
        document.getElementById("budget_modal").close();
        socket.emit('investigate_anomaly', data)
      }

      // HANDLE PURCHASE ORDER DUPLICATION TO INVESTIGATE
      const handleInvestigatePO = () => {
        const data = {
          anomalyType: "Data Duplication",
          dataId: selectedBudgetRow.requestId,
          anomalyFrom: 'Purchase Order Data',
          description: `Duplicated data request from ${selectedPurchaseRow.orderNumber} Customer name: ${selectedPurchaseRow.customerName}. Purchase Order ID: [${selectedPurchaseRow.poId.map(data => `${data}`).join(', ')}]`,
          investigateBy: userData.userName,
          investigateDate: Date.now(),
          status: 'On investigation'
        }
        document.getElementById("purchase_modal").close();
        socket.emit('investigate_anomaly', data)
      }

      // HANDLE INFLOW TRANSACTION DUPLICATION TO INVESTIGATE
      const handleInvestigateInflowDupli = () => {
        const data = {
          anomalyType: "Data Duplication",
          dataId: selectedInflowRow.invoiceId,
          anomalyFrom: 'Inflow Transaction Data',
          description: `${selectedInflowRow.auditor} audits the invoice id: ${selectedInflowRow.invoiceId} many times. Inflow Transaction ID: [${selectedInflowRow.inflowId.map(data => `${data}`).join(', ')}]`,
          investigateBy: userData.userName,
          investigateDate: Date.now(),
          status: 'On investigation'
        }
        document.getElementById("inflow_modal").close();
        socket.emit('investigate_anomaly', data)
      }
      
      // HANDLE OUTFLOW TRANSACTION DUPLICATION TO INVESTIGATE
      const handleInvestigateOutflowDupli = () => {
        const data = {
          anomalyType: "Data Duplication",
          dataId: selectedOutflowRow.payableId,
          anomalyFrom: 'Outflow Transaction Data',
          description: `${selectedOutflowRow.approver} approves a budget for Payable ID: ${selectedOutflowRow.payableId} many times. Outflow Transaction ID: [${selectedOutflowRow.outflowId.map(data => `${data}`).join(', ')}]`,
          investigateBy: userData.userName,
          investigateDate: Date.now(),
          status: 'On investigation'
        }
        document.getElementById("outflow_modal").close();
        socket.emit('investigate_anomaly', data)
      }


    return (
        <div className="max-w-screen-2xl mx-auto mt-4">
            <div className="bg-white/75 shadow-xl rounded-lg p-6">
                <h1 className="text-xl font-bold">Overview</h1>
                <div className="flex gap-4 p-4 overflow-x-auto flex-wrap">
                    <div className="bg-white shadow-xl w-[280px] p-5 rounded-lg mt-3">
                        <p className="text-black font-semibold text-md">Total Flagged Anomalies</p>
                        <div className="flex gap-3 my-3">
                            <FaExclamationTriangle className="text-red-600 text-2xl my-2" />
                            <p className="text-4xl text-black font-bold">{totalFlaggedAnomalies}</p>
                        </div>
                    </div>
                    <div className="bg-white shadow-xl w-[280px] p-5 rounded-lg mt-3">
                        <p className="text-black font-semibold text-md">Total Anomalies Resolved</p>
                        <div className="flex gap-3 my-3">
                            <FaCheckCircle className="text-green-600 text-2xl my-2" />
                            <p className="text-4xl text-black font-bold">{totalAnomaliesResolved}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-5">
  <div className="bg-white/75 shadow-xl rounded-lg p-6">
  <h1 className="text-xl font-bold">Possible Anomaly Transactions</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
      {/* Left Column - Inflow Transactions */}
      <div>
        {isLoadingPIT ? 
        <div className="flex justify-center items-center h-56">
          <div className="relative w-16 h-16">
            <div className="absolute w-full h-full border-4 border-t-transparent border-gray-500 rounded-full animate-spin"></div>
          </div>
        </div>       
        :
        <DataTable
        title="Possible Anomaly Inflow Transactions"
        columns={inflowTransactionsColumns}
        data={filteredInflowTransactionData}
        onRowClicked={handleInflowTransactionClick}
        pagination
        pointerOnHover
        subHeader
        subHeaderComponent={
            <div className="flex items-center gap-2">
                <input
                    type="text"
                    placeholder="Search..."
                    value={inflowSearchText}
                    onChange={handleInflowSearch}
                    className="p-2 border border-gray-400 rounded-lg"
                />
                <button 
                    onClick={handleReloadInflowP} 
                    className="bg-gray-200 hover:bg-gray-300 p-2 rounded-lg"
                    title="Reload"
                >
                    <FaRedo className="text-gray-700" />
                </button>
            </div>
            }
            customStyles={customStyles}
          /> }
      </div>
      
      {/* Right Column - Outflow Transactions */}
      <div>
        {isLoadingPOT ?      
          <div className="flex justify-center items-center h-56">
            <div className="relative w-16 h-16">
              <div className="absolute w-full h-full border-4 border-t-transparent border-gray-500 rounded-full animate-spin"></div>
            </div>
          </div> 
          :
         <DataTable 
          title="Possible Anomaly Outflow Transactions"
          columns={outflowTransactionsColumns}
          data={filteredOutflowTransactionData}
          onRowClicked={handleOutflowTransactionClick}
          pagination
          pointerOnHover
          subHeader
          subHeaderComponent={
            <div className="flex items-center gap-2">
            <input
                type="text"
                placeholder="Search..."
                value={outflowSearchText}
                onChange={handleOutflowSearch}
                className="p-2 border border-gray-400 rounded-lg"
            />
            <button 
                onClick={handleReloadOutflowP} 
                className="bg-gray-200 hover:bg-gray-300 p-2 rounded-lg"
                title="Reload"
            >
                <FaRedo className="text-gray-700" />
            </button>
        </div>
          }
          customStyles={customStyles}
        />}
      </div>
    </div>
  </div>
</div>

{/* Buudget Duplciation */}
<div className="mt-5">
  <div className="bg-white/75 shadow-xl rounded-lg p-6">
  <h1 className="text-xl font-bold">Data Duplication</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
      {/* Left Column - Budget Duplication */}
      <div>
      {isLoadingBRD ? 
        <div className="flex justify-center items-center h-56">
          <div className="relative w-16 h-16">
            <div className="absolute w-full h-full border-4 border-t-transparent border-gray-500 rounded-full animate-spin"></div>
          </div>
        </div> 
        :
        <DataTable
        title="Budget Request Duplication"
        columns={budgetDuplicationColumns}
        data={filteredBudgetDuplicationData}
        onRowClicked={handleBudgetRowClick}
        pagination
        pointerOnHover
        subHeader
        subHeaderComponent={
        <div className="flex items-center gap-2">
        <input
            type="text"
            placeholder="Search..."
            value={budgetDuplicationSearchText}
            onChange={handleBudgetDuplicationSearch}
            className="p-2 border border-gray-400 rounded-lg"
        />
          </div>
              
            }
            customStyles={customStyles}
        />
      }
      </div>
      
      {/* Right Column - puurchase order duplication */}
      <div>
        {isLoadingPOD ? 
          <div className="flex justify-center items-center h-56">
            <div className="relative w-16 h-16">
              <div className="absolute w-full h-full border-4 border-t-transparent border-gray-500 rounded-full animate-spin"></div>
            </div>
          </div> 
          :
          <DataTable 
          title="Purchase Order Duplication"
          columns={purchaseOrderDuplicationColumns}
          data={filteredPurchaseOrderDuplicationData}
          onRowClicked={handlePurchaseRowClick}
          pagination
          pointerOnHover
          subHeader
          subHeaderComponent={
            <div className="flex items-center gap-2">
            <input
                type="text"
                placeholder="Search..."
                value={purchaseOrderDuplicationSearchText}
                onChange={handlePurchaseOrderDuuplicationSearch}
                className="p-2 border border-gray-400 rounded-lg"
            />
        </div>
          }
          customStyles={customStyles}
        />
        }
      </div>

          {/*INFFLOW DUPLICATION */}
      <div>
        {isLoadingID ? 
        <div className="flex justify-center items-center h-56">
          <div className="relative w-16 h-16">
            <div className="absolute w-full h-full border-4 border-t-transparent border-gray-500 rounded-full animate-spin"></div>
          </div>
        </div>  
        :     
        <DataTable 
          title="Inflow Transaction Duplication"
          columns={inflowDuplicationColumns}
          data={filteredInflowDuplicationData}
          onRowClicked={handleInflowRowClick}
          pagination
          pointerOnHover
          subHeader
          subHeaderComponent={
            <div className="flex items-center gap-2">
            <input
                type="text"
                placeholder="Search..."
                value={inflowDuplicationSearchText}
                onChange={handleInflowDuplicationSearch}
                className="p-2 border border-gray-400 rounded-lg"
            />
        </div>
          }
          customStyles={customStyles}
        />}
      </div>

        {/*OUTFLOW DUPLICATION */}
        <div>
          {isLoadingOD ?
          <div className="flex justify-center items-center h-56">
            <div className="relative w-16 h-16">
              <div className="absolute w-full h-full border-4 border-t-transparent border-gray-500 rounded-full animate-spin"></div>
            </div>
          </div>  
          :
          <DataTable 
          title="Outflow Transaction Duplication"
          columns={outflowDuplicationColumns}
          data={filteredOutflowDuplicationData}
          onRowClicked={handleOutflowRowClick}
          pagination
          pointerOnHover
          subHeader
          subHeaderComponent={
            <div className="flex items-center gap-2">
            <input
                type="text"
                placeholder="Search..."
                value={outflowDuplicationSearchText}
                onChange={handleOutflowDuplicationSearch}
                className="p-2 border border-gray-400 rounded-lg"
            />
        </div>
          }
          customStyles={customStyles}
        />
          }
      </div>
    </div>
  </div>
</div>


<div className="mt-5 mb-5">
  <div className="bg-white/75 shadow-xl rounded-lg p-6">
  <h1 className="text-xl font-bold">Login Anomalies</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
      {/* Left Column - Suspicious Login */}
      <div>
        {isLoadingSL ? 
          <div className="flex justify-center items-center h-56">
            <div className="relative w-16 h-16">
              <div className="absolute w-full h-full border-4 border-t-transparent border-gray-500 rounded-full animate-spin"></div>
            </div>
          </div>  
          :
          <DataTable
          title="Suspicious Login"
          columns={unusualActivityColumns}
          data={filteredUnusualActivityData}
          onRowClicked={handleUnusualActivityClick}
          pagination
          pointerOnHover
          subHeader
          subHeaderComponent={
              <div className="flex items-center gap-2">
                  <input
                      type="text"
                      placeholder="Search..."
                      value={unusualActivitySearchText}
                      onChange={handleInflowSearch}
                      className="p-2 border border-gray-400 rounded-lg"
                  />
              </div>
          }
          customStyles={customStyles}
        />
        }
      </div>
      
      {/* Right Column - Failed Login attempts */}
      <div>
        {isLoadingFLA ?
          <div className="flex justify-center items-center h-56">
            <div className="relative w-16 h-16">
              <div className="absolute w-full h-full border-4 border-t-transparent border-gray-500 rounded-full animate-spin"></div>
            </div>
          </div>  
          :
          <DataTable 
          title="Failed Login Attempts"
          columns={failedAttemptsColumns}
          data={filteredFailedLoginAttemptsData}
          onRowClicked={handleFailedLoginAttemptClick}
          pagination
          pointerOnHover
          subHeader
          subHeaderComponent={
            <div className="flex items-center gap-2">
            <input
                type="text"
                placeholder="Search..."
                value={failedLoginAttemptsSearchText}
                onChange={handleOutflowSearch}
                className="p-2 border border-gray-400 rounded-lg"
            />
        </div>
          }
          customStyles={customStyles}
        />
        }
      </div>
    </div>
  </div>
</div>

      <div className="items-center justify-center bg-white rounded-lg shadow-xl border border-gray-300 mb-10">
          <div className="mx-4">
            <div className="overflow-x-auto w-full">
              <DataTable
                title="Flaged Anomalies"
                columns={flaggedAnomalyColumns}
                data={filteredFlaggedAnomalyData}
                onRowClicked={handleFlaggedAnomalyClick}
                pagination
                defaultSortField="name"
                pointerOnHover
                subHeader
                subHeaderComponent={
                  <input
                    type="text"
                    placeholder="Search..."
                    value={flaggedAnomalySearchText}
                    onChange={handleFlaggedAnomalySearch}
                    className="mb-2 p-2 border border-gray-400 rounded-lg"
                  />
                }
                customStyles={customStyles}
              />
            </div>
          </div>
        </div>


{/* MODALS */}
{selectedInflowTransaction && (
        <dialog id="inflow_transaction_modal" className="modal">
          <div className="modal-box w-full max-w-[900px] rounded-xl shadow-2xl bg-white p-10">
            <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">Inflow Transaction Preview</h1>
            <div className="space-y-4">
                    <div className="flex justify-between">
                      <p className="font-medium"><strong>ID:</strong></p>
                      <p className="text-gray-700">{selectedInflowTransaction._id}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="font-medium"><strong>Date & Time:</strong></p>
                      <p className="text-gray-700">{selectedInflowTransaction.dateTime}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="font-medium"><strong>Auditor:</strong></p>
                      <p className="text-gray-700">{selectedInflowTransaction.auditor}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="font-medium"><strong>Invoice ID:</strong></p>
                      <p className="text-gray-700">{selectedInflowTransaction.invoiceId}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="font-medium"><strong>Customer Name:</strong></p>
                      <p className="text-gray-700">{selectedInflowTransaction.customerName}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="font-medium"><strong>Total Amount:</strong></p>
                      <p className="text-gray-700">{formatCurrency(selectedInflowTransaction.totalAmount)}</p>
                    </div>
                  </div>
            <div className="flex justify-center mt-4">
              <button className="btn btn-outline btn-error" onClick={handleInvestigateInflow}>Investigate</button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button type="button" onClick={() => document.getElementById('inflow_transaction_modal').close()}>Close</button>
          </form>
        </dialog>
      )}
      {selectedOutflowTransaction && (
        <dialog id="outflow_transaction_modal" className="modal">
          <div className="modal-box w-full max-w-[900px] rounded-xl shadow-2xl bg-white p-10">
            <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">Outflow Transaction Preview</h1>
            <div className="space-y-4">
                    <div className="flex justify-between">
                      <p className="font-medium"><strong>ID:</strong></p>
                      <p className="text-gray-700">{selectedOutflowTransaction._id}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="font-medium"><strong>Date & Time:</strong></p>
                      <p className="text-gray-700">{selectedOutflowTransaction.dateTime}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="font-medium"><strong>Approver:</strong></p>
                      <p className="text-gray-700">{selectedOutflowTransaction.approver}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="font-medium"><strong>Approver ID:</strong></p>
                      <p className="text-gray-700">{selectedOutflowTransaction.approverId}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="font-medium"><strong>Payable ID:</strong></p>
                      <p className="text-gray-700">{selectedOutflowTransaction.payableId}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="font-medium"><strong>Category:</strong></p>
                      <p className="text-gray-700">{selectedOutflowTransaction.category}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="font-medium"><strong>Department:</strong></p>
                      <p className="text-gray-700">{selectedOutflowTransaction.department}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="font-medium"><strong>Total Amount:</strong></p>
                      <p className="text-gray-700">{formatCurrency(selectedOutflowTransaction.totalAmount)}</p>
                    </div>
                  </div>
            <div className="flex justify-center mt-4">
              <button className="btn btn-outline btn-error" onClick={handleInvestigateOutflow}>Investigate</button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button type="button" onClick={() => document.getElementById('outflow_transaction_modal').close()}>Close</button>
          </form>
        </dialog>
      )}

{selectedBudgetRow && (
  <dialog id="budget_modal" className="modal">
    <div className="modal-box w-full max-w-[900px] rounded-xl shadow-2xl bg-white p-10">
      <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">Budget Request Preview</h1>
      <div className="space-y-4">
        <div className="flex justify-between">
          <p className="font-medium"><strong>Request ID:</strong></p>
          <p className="text-gray-700">{selectedBudgetRow.requestId}</p>
        </div>
        <div className="flex justify-between">
          <p className="font-medium"><strong>Department:</strong></p>
          <p className="text-gray-700">{selectedBudgetRow.department}</p>
        </div>
        <div className="flex justify-between">
          <p className="font-medium"><strong>Category:</strong></p>
          <p className="text-gray-700">{selectedBudgetRow.category}</p>
        </div>
        <div className="flex justify-between">
          <p className="font-medium"><strong>Total Request:</strong></p>
          <p className="text-gray-700">{formatCurrency(selectedBudgetRow.totalRequest)}</p>
        </div>
        <div className="flex justify-between border-b-2 border-gray-500">
          <p className="font-medium"><strong>Count:</strong></p>
          <p className="text-gray-700">{selectedBudgetRow.count}</p>
        </div>
        {/* Dynamically render Budget Request IDs */}
        {selectedBudgetRow.budgetReqId && selectedBudgetRow.budgetReqId.map((id, index) => (
          <div key={index} className="flex justify-between">
            <p className="font-medium"><strong>Budget Request ID {index + 1}:</strong></p>
            <p className="text-gray-700 max-w-2xl text-justify">{id}</p>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-4">
        <button className="btn btn-primary" onClick={handleInvestigateBudgetDupli}>Investigate</button>
      </div>
    </div>
    <form method="dialog" className="modal-backdrop">
      <button type="button" onClick={() => document.getElementById('budget_modal').close()}>Close</button>
    </form>
  </dialog>
)}

      {selectedPurchaseRow && (
        <dialog id="purchase_modal" className="modal">
          <div className="modal-box w-full max-w-[900px] rounded-xl shadow-2xl bg-white p-10">
            <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">Purchase Order Preview</h1>
            <div className="space-y-4">
                    <div className="flex justify-between">
                      <p className="font-medium"><strong>Order Number:</strong></p>
                      <p className="text-gray-700">{selectedPurchaseRow.orderNumber}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="font-medium"><strong>Customer Name:</strong></p>
                      <p className="text-gray-700">{selectedPurchaseRow.customerName}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="font-medium"><strong>Total Amount:</strong></p>
                      <p className="text-gray-700">{formatCurrency(selectedPurchaseRow.totalAmount)}</p>
                    </div>
                    <div className="flex justify-between border-b-2 border-gray-500">
                      <p className="font-medium"><strong>Count:</strong></p>
                      <p className="text-gray-700">{selectedPurchaseRow.count}</p>
                    </div>
                    {selectedPurchaseRow.poId && selectedPurchaseRow.poId.map((id, index) => (
                      <div key={index} className="flex justify-between">
                        <p className="font-medium"><strong>Purchase Order ID: {index + 1}:</strong></p>
                        <p className="text-gray-700 max-w-2xl text-justify">{id}</p>
                      </div>
                    ))}
                    </div>
            <div className="flex justify-center mt-4">
              <button className="btn btn-primary" onClick={handleInvestigatePO}>Investigate</button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button type="button" onClick={() => document.getElementById('purchase_modal').close()}>Close</button>
          </form>
        </dialog>
      )}
      {selectedInflowRow && (
        <dialog id="inflow_modal" className="modal">
          <div className="modal-box w-full max-w-[900px] rounded-xl shadow-2xl bg-white p-10">
            <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">Inflow Transaction Preview</h1>
            <div className="space-y-4">
                    <div className="flex justify-between">
                      <p className="font-medium"><strong>Auditor ID:</strong></p>
                      <p className="text-gray-700">{selectedInflowRow.auditorId}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="font-medium"><strong>Auditor:</strong></p>
                      <p className="text-gray-700">{selectedInflowRow.auditor}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="font-medium"><strong>Invoice ID:</strong></p>
                      <p className="text-gray-700">{selectedInflowRow.invoiceId}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="font-medium"><strong>Total Amount:</strong></p>
                      <p className="text-gray-700">{formatCurrency(selectedInflowRow.totalAmount)}</p>
                    </div>
                    <div className="flex justify-between border-b-2 border-gray-500">
                      <p className="font-medium"><strong>Count:</strong></p>
                      <p className="text-gray-700">{selectedInflowRow.count}</p>
                    </div>
                    {selectedInflowRow.inflowId && selectedInflowRow.inflowId.map((id, index) => (
                      <div key={index} className="flex justify-between">
                        <p className="font-medium"><strong>Inflow Transaction ID: {index + 1}:</strong></p>
                        <p className="text-gray-700 max-w-2xl text-justify">{id}</p>
                      </div>
                    ))}
                    </div>
            <div className="flex justify-center mt-4">
              <button className="btn btn-primary" onClick={handleInvestigateInflowDupli}>Investigate</button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button type="button" onClick={() => document.getElementById('inflow_modal').close()}>Close</button>
          </form>
        </dialog>
      )}
      {selectedOutflowRow && (
        <dialog id="outflow_modal" className="modal">
          <div className="modal-box w-full max-w-[900px] rounded-xl shadow-2xl bg-white p-10">
            <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">Outflow Transaction Preview</h1>
            <div className="space-y-4">
                    <div className="flex justify-between">
                      <p className="font-medium"><strong>Approver ID:</strong></p>
                      <p className="text-gray-700">{selectedOutflowRow.approverId}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="font-medium"><strong>Approver:</strong></p>
                      <p className="text-gray-700">{selectedOutflowRow.approver}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="font-medium"><strong>Payable ID:</strong></p>
                      <p className="text-gray-700">{selectedOutflowRow.payableId}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="font-medium"><strong>Total Amount:</strong></p>
                      <p className="text-gray-700">{formatCurrency(selectedOutflowRow.totalAmount)}</p>
                    </div>
                    <div className="flex justify-between border-b-2 border-gray-500">
                      <p className="font-medium"><strong>Count:</strong></p>
                      <p className="text-gray-700">{selectedOutflowRow.count}</p>
                    </div>
                    {selectedOutflowRow.outflowId && selectedOutflowRow.outflowId.map((id, index) => (
                      <div key={index} className="flex justify-between">
                        <p className="font-medium"><strong>Outflow Transaction ID: {index + 1}:</strong></p>
                        <p className="text-gray-700 max-w-2xl text-justify">{id}</p>
                      </div>
                    ))}
                    </div>
            <div className="flex justify-center mt-10">
              <button className="btn btn-primary" onClick={handleInvestigateOutflowDupli}>Investigate</button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button type="button" onClick={() => document.getElementById('outflow_modal').close()}>Close</button>
          </form>
        </dialog>
      )}

            {selectedUnusualActivity && (
        <dialog id="unusual_activity_modal" className="modal">
          <div className="modal-box w-full max-w-[900px] rounded-xl shadow-2xl bg-white p-10">
            <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">Suspicious Login Preview</h1>
            <div className="space-y-4">
                    <div className="flex justify-between">
                      <p className="font-medium"><strong>User ID:</strong></p>
                      <p className="text-gray-700">{selectedUnusualActivity.userId}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="font-medium"><strong>Username:</strong></p>
                      <p className="text-gray-700">{selectedUnusualActivity.username}</p>
                    </div>
                    <div className="flex justify-between border-b-2 border-gray-500">
                      <p className="font-medium"><strong>Role:</strong></p>
                      <p className="text-gray-700">{selectedUnusualActivity.role}</p>
                    </div>
                    {selectedUnusualActivity.ipAddress && selectedUnusualActivity.ipAddress.map((id, index) => (
                      <div key={index} className="flex justify-between">
                        <p className="font-medium"><strong>IP Address {index + 1}:</strong></p>
                        <p className="text-gray-700 max-w-2xl text-justify">[{id}]</p>
                      </div>
                    ))}
                    {selectedUnusualActivity.location && selectedUnusualActivity.location.map((id, index) => (
                      <div key={index} className="flex justify-between">
                        <p className="font-medium"><strong>Location {index + 1}:</strong></p>
                        <p className="text-gray-700 max-w-2xl text-justify">[{id}]</p>
                      </div>
                    ))}
                    {selectedUnusualActivity.deviceInfo && selectedUnusualActivity.deviceInfo.map((id, index) => (
                      <div key={index} className="flex justify-between">
                        <p className="font-medium"><strong>Device Info {index + 1}:</strong></p>
                        <p className="text-gray-700 max-w-2xl text-justify">[{id}]</p>
                      </div>
                    ))}
                    </div>

          </div>
          <form method="dialog" className="modal-backdrop">
            <button type="button" onClick={() => document.getElementById('unusual_activity_modal').close()}>Close</button>
          </form>
        </dialog>
      )}
      {selectedRowData && (
        <dialog id="failed_login_attempt_modal" className="modal">
          <div className="modal-box w-full max-w-[900px] rounded-xl shadow-2xl bg-white p-10">
            <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">Failed Login Attempt Preview</h1>
            <div className="space-y-4">
                    <div className="flex justify-between">
                      <p className="font-medium"><strong>ID:</strong></p>
                      <p className="text-gray-700">{selectedRowData._id}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="font-medium"><strong>User ID:</strong></p>
                      <p className="text-gray-700">{selectedRowData.userId}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="font-medium"><strong>Username:</strong></p>
                      <p className="text-gray-700">{selectedRowData.username}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="font-medium"><strong>IP Address:</strong></p>
                      <p className="text-gray-700 max-w-xl text-justify">
                        {selectedRowData.ipAddress}
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <p className="font-medium"><strong>Attempts:</strong></p>
                      <p className="text-gray-700">{selectedRowData.attempts}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="font-medium"><strong>Attempt Date:</strong></p>
                      <p className="text-gray-700">{selectedRowData.attemptDate}</p>
                    </div>
                    </div>
            <div className="flex justify-center mt-4">
              <button className="btn btn-outline btn-error"
               onClick={() => {
                document.getElementById("block_modal").showModal();
              }}
              >Block User</button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button type="button" onClick={() => document.getElementById('failed_login_attempt_modal').close()}>Close</button>
          </form>
        </dialog>
      )}
      {selectedFlaggedAnomaly && (
        <dialog id="flagged_anomaly_modal" className="modal">
          <div className="modal-box w-full max-w-[900px] rounded-xl shadow-2xl bg-white p-10">
            <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">Flagged Anomaly Preview</h1>
            <div className="space-y-4">
                    <div className="flex justify-between">
                      <p className="font-medium"><strong>Username:</strong></p>
                      <p className="text-gray-700">{selectedFlaggedAnomaly.username}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="font-medium"><strong>Role:</strong></p>
                      <p className="text-gray-700">{selectedFlaggedAnomaly.role}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="font-medium"><strong>ID:</strong></p>
                      <p className="text-gray-700">{selectedFlaggedAnomaly._id}</p>
                    </div>
                    </div>
            <div className="flex justify-center mt-4">
              <button className="btn btn-success"
              onClick={() => {
                document.getElementById("resolve_modal").showModal();}}>Resolve</button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button type="button" onClick={() => document.getElementById('flagged_anomaly_modal').close()}>Close</button>
          </form>
        </dialog>
      )}

<dialog id="resolve_modal" className="modal">
      <div className="modal-box w-full max-w-[900px] rounded-xl shadow-2xl bg-white p-10">
        <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">Resolve Anomaly</h1>
        <div className="space-y-4">
          <div className="flex-col">
            <p className="font-lg text-center mb-2"><strong>Description:</strong></p>
            <textarea
              className="textarea textarea-bordered w-full ml-5 text-gray-700"
              value={description}  
              onChange={handleDescriptionChange}  
              placeholder="Enter the description here"
            ></textarea>
          </div>
          <div className="flex justify-center gap-10 mt-10">
            <button className="btn btn-error">Delete</button>
            <button className="btn btn-success">Revert</button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button
            type="button"
            onClick={() => document.getElementById('resolve_modal').close()}
          >
            Close
          </button>
        </form>
      </div>
    </dialog>

      {/* PASSWORD VERIFICATION FOR Block */}
    <dialog id="block_modal" className="modal">
        <div className="modal-box">
          <form className="space-y-4" onSubmit={handleBlockUser} >
              <div>
                <h3 className="font-bold text-lg text-center">Enter Password to Proceed</h3>
                  <label className="block text-gray-600 font-medium mb-1">Password</label>
                  <input
                    type="password"
                    placeholder="Enter your password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                    value={password}
                    required
                    onChange={(e) => setPassword(e.target.value)}
                  />
              </div>
              {errorVerification && <h1 className="text-red-500">{errorVerification}</h1>}

              {isSubmitLoading && 
                  <button
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-800" type="submit"
                  >
                  Confirm Password  
                  </button>
                }

                {!isSubmitLoading && 
                  <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-800 mt-4 w-[140px]">
                    <span className="loading loading-spinner loading-sm"></span>
                  </button>
                }
          </form>
        </div>
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
    </dialog> 
        </div>
    );
}

export default AnomalyDetection;
