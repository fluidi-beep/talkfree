import {
  Button,
  Container,
  Divider,
  List,
  ListItem,
  TextField,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useEffect, useReducer, useState } from "react";
import state from "../../state";
import { IChannel } from "../../types";
import JoinNewChannel from "./JoinNewChannel";

const initialState = {
  channels: [],
};

const reducer = (state: any, channel: IChannel) => {
  return {
    channels: [...state.channels, channel],
  };
};

const useStyles = makeStyles((theme) => {
  console.log("theme", theme);
  return {
    container: {
      paddingTop: "60px",
      backgroundColor: theme.palette.primary.dark,
      width: "100%",
      marginLeft: 0,
      minHeight: "100vh",
    },
    divider: {
      backgroundColor: theme.palette.secondary.main,
      marginBottom: theme.spacing(3),
    },
    channelItem: {
      width: "100%",
      "&:hover": {},
    },
    channelItemBtn: {
      justifyContent: "flex-start",
      width: "100%",
    },
    hashtag: {
      alignSelf: "flex-end",
    },
    channelName: {
      marginLeft: theme.spacing(1),
      textTransform: "none",
    },
  };
});

const ChannelsAndDMs = () => {
  const [channelState, dispatch] = useReducer(reducer, initialState);

  const classes = useStyles();

  const ChannelItem = ({ name }: { name: string }) => {
    if (!name) return null;
    return (
      <ListItem className={classes.channelItem}>
        <Button className={classes.channelItemBtn}>
          <Typography className={classes.hashtag} variant="h6">
            #
          </Typography>
          <Typography className={classes.channelName} variant="h6">
            {name}
          </Typography>
        </Button>
      </ListItem>
    );
  };

  useEffect(() => {
    state.public
      .get("channels")
      .map()
      .on((channel: any) => {
        if (!channel.name) return;
        console.log("channel added", channel);

        dispatch(channel);
      });

    // cleanup
    return state.public.get("channels").off();
  }, []);
  return (
    <Container className={classes.container}>
      <Typography>Channels</Typography>
      <List>
        {[...new Set(channelState.channels)].map((channel) => {
          return (
            <div
              onClick={() => {
                console.log(channel);
                console.log("CLICKING");
                state.local.get("currentChannel").put(channel, (ack) => {
                  console.log("ack", ack);
                });
                console.log("should have gotten an ack...");
              }}
            >
              <ChannelItem name={channel.name} />
            </div>
          );
        })}
      </List>
      <JoinNewChannel />
    </Container>
  );
};

export default ChannelsAndDMs;
