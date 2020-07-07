import Graph from "react-graph-vis";
import React, { useEffect, useState } from "react";
import axios from "axios";

const ContestantGraph = (props) => {
  const [graph, setGraph] = useState({
    nodes: [],
    edges: [],
  });

  const options = {
    layout: {
      hierarchical: {
        enabled: false,
        nodeSpacing: 425,
        blockShifting: false,
        edgeMinimization: false,
        sortMethod: "directed",
      },
    },
    physics: {
      enabled: true,
      // hierarchicalRepulsion: {
      //   nodeDistance: 100,
      //   damping: 0.09,
      // },
      // barnesHut: {
      //   springLength: 1000,
      // },
      // solver: "barnesHut",
    },
    nodes: {
      shape: "dot",
      size: 50,
      font: {
        size: 32,
      },
      borderWidth: 2,
    },
    edges: {
      width: 2,
    },
    autoResize: true,
    height: "100%",
    width: "100%",
  };

  const events = {
    select: function(event) {
      var { nodes, edges } = event;
    },
  };

  const getAppearanceGraph = () => {
    axios
      .get(`${process.env.REACT_APP_USERS_SERVICE_URL}/appearances/graph`)
      .then((res) => {
        setGraph(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getAppearanceGraph();
  }, []);

  return (
    <Graph
      graph={graph}
      options={options}
      events={events}
      getNetwork={(network) => {
        //  if you want access to vis.js network api you can set the state in a parent component using this property
        network.on("stabilizationIterationsDone", function() {
          network.setOptions({ physics: false });
        });
      }}
      style={{ height: "1000px", width: "100%" }}
    />
  );
};

export default ContestantGraph;
