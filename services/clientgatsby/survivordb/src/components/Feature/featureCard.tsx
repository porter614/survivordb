/** @jsx jsx */
import React from "react"
import { jsx } from "theme-ui"
import { Paper, Button, Card } from "@material-ui/core"
import { Grid } from "@material-ui/core"
import { Link } from "gatsby"

const FeatureCard = ({ title, link, details, bg, icon: Icon }) => (
  <a href={link}>
    <Card
      style={{
        backgroundColor: "#2c424d",
        height: "20vh",
        width: "auto",
        padding: "10px"
      }}
      sx={{
        width: `100%`,
        boxShadow: `lg`,
        position: `relative`,
        textDecoration: `none`,
        borderRadius: `lg`,
        px: 4,
        py: [4, 5],
        color: `white`,
        transition: `all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important`,
        "&:hover": {
          color: `white !important`,
          transform: `translateY(-5px)`,
          boxShadow: `xl`
        }
      }}
    >
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <h4
            style={{
              textAlign: "center",
              fontSize: "2vw",
              fontFamily: "Survivants"
            }}
          >
            {title}
          </h4>
        </Grid>
        <Grid item xs={8}>
          <div
            style={{
              textAlign: "right",
              fontSize: "1vw"
            }}
          >
            {details}
          </div>
        </Grid>
        <Grid
          item
          xs={4}
          style={{
            margin: "auto"
          }}
        >
          {Icon && <Icon size={80} />}
        </Grid>
      </Grid>
    </Card>
  </a>
)

export default FeatureCard
