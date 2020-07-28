import Graph from "react-graph-vis"
import React, { useEffect, useState } from "react"
import axios from "axios"
import "./mystyles.scss"
import Layout from "../components/layout"
import SEO from "../components/seo"

const ContestantGraph = props => {
  const [selectedNode, setSelectedNode] = useState(null)

  const [graph, setGraph] = useState({
    nodes: [],
    edges: [],
  })

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
    },
    nodes: {
      shape: "dot",
      size: 50,
      font: {
        size: 32,
      },
      borderWidth: 2,
    },
    interaction: { multiselect: true, navigationButtons: true },
    edges: {
      width: 2,
    },
    autoResize: true,
    height: "100%",
    width: "100%",
  }

  const events = {
    doubleClick: function (event) {
      var { nodes, edges } = event
      console.log(nodes)
      if (nodes.length === 1) {
        var node = nodes[0]
        window.location.href = `/versus?id=${node}`
      }
    },
  }

  const getAppearanceGraph = () => {
    axios
      .get(`${process.env.GATSBY_USERS_SERVICE_URL}/appearances/graph`)
      .then(res => {
        setGraph(res.data)
        console.log(res.data)
      })
      .catch(err => {
        console.log(err)
      })
  }

  useEffect(() => {
    getAppearanceGraph()
  }, [])

  return (
    <Layout>
      <SEO title="Graph" />
      <Graph
        graph={graph}
        options={options}
        events={events}
        getNetwork={network => {
          //  if you want access to vis.js network api you can set the state in a parent component using this property
          network.on("stabilizationIterationsDone", function () {
            network.setOptions({
              physics: false,
            })
          })
        }}
        style={{ height: "2000px", width: "100%" }}
      />
    </Layout>
  )
}

export default ContestantGraph
