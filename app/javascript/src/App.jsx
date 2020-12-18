import React, { useEffect, useState } from "react";

const hasChildren = ({ node, nodes }) =>
  nodes.some((item) => item.parent_id === node.id);
const getChildren = ({ node, nodes }) =>
  nodes.filter((item) => item.parent_id === node.id);

const Level = ({ nodes, parent, selectedNode, onClick }) => {
  const bgColor = selectedNode === parent.id ? 'yellow' : '';

  const name = parent.last_name ? (
    <div className="name" style={{ backgroundColor: bgColor }} onClick={() => onClick(parent.id) }>
      {parent.first_name} {parent.last_name}
    </div>
  ) : null;

  if (!hasChildren({ nodes, node: parent })) {
    return name;
  }

  return (
    <div>
      {name}
      <ul>
        {getChildren({ node: parent, nodes }).map((child) => (
          <li key={child.id}>
            <Level nodes={nodes} parent={child} selectedNode={selectedNode} onClick={onClick} />
          </li>
        ))}
      </ul>
    </div>
  );
};

const App = () => {
  const [nodes, setNodes] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [newParentNode, setNewParentNode] = useState(null);

  useEffect(() => {
    if (selectedNode && newParentNode) {
      fetch("/nodes/" + selectedNode, {
        method: "PATCH",
        headers: new window.Headers({
          "Content-Type": "application/json; charset=utf-8",
          Accept: "application/json",
          'X-CSRF-Token': document.querySelector("meta[name='csrf-token']").getAttribute("content"),
        }),
        body: JSON.stringify({
          node: { parent_id: newParentNode }
        })
      })
        .then((resp) => resp.json())
        .then((data) => {
          setSelectedNode(null);
          setNewParentNode(null);
          setNodes(data);
        });
    }
  });

  useEffect(() => {
      fetch("/nodes", {
        method: "GET",
        headers: new window.Headers({
          "Content-Type": "application/json; charset=utf-8",
          Accept: "application/json",
        }),
      })
        .then((resp) => resp.json())
        .then((data) => {
          setNodes(data);
        });
  }, []);

  const message = selectedNode ? <p>Select the new parent node!</p> : <p>Select which node you'd like to move</p>;
  const onClick = selectedNode ? setNewParentNode : setSelectedNode;

  return (
    <>
      <h1>Org Chart</h1>
      {message}
      {nodes ? (
        <Level nodes={nodes} parent={nodes.find((node) => node.root)} selectedNode={selectedNode} onClick={onClick} />
      ) : (
        "loading..."
      )}
    </>
  );
};

export default App;
