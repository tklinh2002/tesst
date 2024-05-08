import { W3mButton, Web3Modal } from "@web3modal/wagmi-react-native";
import React, { useState } from "react";
import { View, Text, StyleSheet, Button, ScrollView } from "react-native";
import {
  useAccount,
  useBalance,
  useConnect,
  useDisconnect,
  useEnsName,
  useContractRead,
  useContractWrite,
} from "wagmi";
import { abi } from './abi'
const Profile = () => {
  const { address, isConnected, connector: activeConnector } = useAccount();
  const { data: ensName } = useEnsName({ address });
  const balance = useBalance({ address: address });
  const { disconnect } = useDisconnect();

  // State variables for testing write methods
  const [id, setId] = useState(1); // Replace with desired ID for testing
  const [signature, setSignature] = useState("0000000000000000"); // Replace with a valid signature
  const [title, setTitle] = useState("Sample Contract");
  const [description, setDescription] = useState("Sample Description");
  const [bids, setBids] = useState(0); // Sample bid array
  const [jobId, setJobId] = useState(2); // Replace with a valid job ID
  const freelancerId = 1; // Replace with a freelancer address
  const clientId = 1; // Replace with a client address
  const reason = "Sample cancellation reason"; // Reason for canceling a contract
  const currentJobId = 3; // Replace with a valid job ID for getting job info

  // Contract interactions (write methods)
  const acceptContract = useContractWrite({
    address: "0x12C33E9f080907dfF4BFaE4A841f4F2cA7E975eD", // Replace with your contract address
    abi,
    functionName: "acceptContract",
    args: [id, signature],
  });

  const cancelContract = useContractWrite({
    address: "0x12C33E9f080907dfF4BFaE4A841f4F2cA7E975eD",
    abi,
    functionName: "cancelContract",
    args: [id, reason],
  });

  const createContract = useContractWrite({
    address: "0x12C33E9f080907dfF4BFaE4A841f4F2cA7E975eD",
    abi,
    functionName: "createContract",
    args: [title, description, signature, 0, jobId, freelancerId, clientId],
    onError: (error) => {
      if (error.message.includes("User rejected the transaction")) {
        console.log("User rejected contract creation.");
        // Optionally display a user-friendly message in your app
      } else {
        console.error("Error creating contract:", error);
        // Handle other errors (e.g., insufficient funds, contract logic errors)
      }
    },
  });

  const finalizeContract = useContractWrite({
    address: "0x12C33E9f080907dfF4BFaE4A841f4F2cA7E975eD",
    abi,
    functionName: "finalizeContract",
    args: [id],
  });

  const reportCompletion = useContractWrite({
    address: "0x12C33E9f080907dfF4BFaE4A841f4F2cA7E975eD",
    abi,
    functionName: "reportCompletion",
    args: [id],
  });

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View style={styles.container}>
        <Web3Modal />
        {isConnected ? (
          <>
            <Text>Connected to {ensName ?? address}</Text>
            <Text>Balance: {balance.data?.formatted}</Text>
            <Button title="Disconnect" onPress={() => disconnect()} />

            {/* Test buttons for write methods */}
            <View>
              <Button title="Accept Contract" onPress={() => acceptContract} />
              
              {acceptContract.isLoading && <Text>Accepting contract...</Text>}
              {acceptContract.error && (
                <Text>
                  Error accepting contract: {acceptContract.error.message}
                </Text>
              )}

              <Button title="Cancel Contract" onPress={() => cancelContract} />
              {cancelContract.isLoading && <Text>Canceling contract...</Text>}
              {cancelContract.error && (
                <Text>
                  Error canceling contract: {cancelContract.error.message}
                </Text>
              )}

              <Button
                title="Create Contract"
                disabled={createContract.isLoading}
                onPress={()=>createContract.write()}
              />
              <Text>{createContract.isLoading}</Text>
              {createContract.isLoading && <Text>Creating contract...</Text>}

              <Button
                title="Finalize Contract"
                disabled={finalizeContract.isLoading}
                onPress={() => finalizeContract}
              />
              {finalizeContract.isLoading && (
                <Text>Finalizing contract...</Text>
              )}
              {finalizeContract.error && (
                <Text>
                  Error finalizing contract: {finalizeContract.error.message}
                </Text>
              )}

              <Button
                title="Report Completion"
                disabled={reportCompletion.isLoading}
                onPress={() => reportCompletion}
              />
              {reportCompletion.isLoading && (
                <Text>Reporting completion...</Text>
              )}
              {reportCompletion.error && (
                <Text>
                  Error reporting completion: {reportCompletion.error.message}
                </Text>
              )}
            </View>

            {/* Contract call results (if any) */}
            {acceptContract.data && (
              <Text>
                Contract accepted: {JSON.stringify(acceptContract.data)}
              </Text>
            )}
            {cancelContract.data && (
              <Text>
                Contract canceled: {JSON.stringify(cancelContract.data)}
              </Text>
            )}
            
            {finalizeContract.data && (
              <Text>
                Contract finalized: {JSON.stringify(finalizeContract.data)}
              </Text>
            )}
            {reportCompletion.data && (
              <Text>
                Completion reported: {JSON.stringify(reportCompletion.data)}
              </Text>
            )}
          </>
        ) : (
          <>
            <W3mButton balance="show" />
          </>
        )}
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
export default Profile;
