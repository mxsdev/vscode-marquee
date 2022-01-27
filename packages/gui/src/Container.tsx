import React, { useContext, useEffect, useMemo, useState } from "react";

import { Grid, CircularProgress } from "@material-ui/core";
import { WidthProvider, Responsive } from "react-grid-layout";
import "./css/react-grid-layout.css";
import "react-resizable/css/styles.css";

import ModeContext from "./contexts/ModeContext";
import { PrefContext, getEventListener, MarqueeEvents } from "@vscode-marquee/utils";

import Navigation from "./components/Navigation";
import SettingsDialog from './dialogs/SettingsDialog';
import backgrounds from './utils/backgrounds';
import { themes } from "./constants";

const ResponsiveReactGridLayout = WidthProvider(Responsive);
const sizes = ["lg", "md", "sm", "xs", "xxs"] as const;

export const WidgetLayout = React.memo(() => {
  const { modes, widgets, _setCurrentModeLayout, mode, modeName } = useContext(
    ModeContext
  );

  //if a new widget is introduced that doesn't exist in their current
  //stored layout, we patch the layout so that it displays properly
  //to encourage them to integrate or hide it
  //this finds the missing entries and patches them
  const layoutConfig = useMemo(() => {
    if (!modeName || !modes[modeName]) {
      return null;
    }

    if (
      Object.entries(mode).length !== 0 &&
      Object.entries(modes).length !== 0 &&
      Object.entries(mode.layouts).length !== 0
    ) {
      const newLayouts = mode.layouts;
      let modified = false;

      sizes.forEach((size) => {
        const sizeArr = newLayouts[size];
        Object.keys(widgets).forEach((widget) => {
          const found = sizeArr.findIndex((entry) => entry["i"] === widget);
          if (found === -1) {
            const widgetObject = {
              minW: 2,
              minH: 6,
              static: false,
              moved: false,
              x: 0,
              y: 0,
              h: 12,
              w: 4,
              i: widget,
            };

            newLayouts[size].push(widgetObject);
            modified = true;
          }
        });
      });

      if (modified) {
        return newLayouts;
      } else {
        return mode.layouts;
      }
    }
    return null;
  }, [mode, modes, modeName]);

  let generateWidgets = () => {
    return Object.keys(widgets)
      .filter((widget) => modes[modeName] && modes[modeName].widgets[widget])
      .map((widget) => {
        const Widget = widgets[widget].element;
        return React.cloneElement(<Widget />, {
          name: widget,
          label: widgets[widget].label,
          key: widget
        });
      }
    );
  };

  return (
    <>
      {!layoutConfig && (
        <Grid
          container
          style={{ height: "100%" }}
          alignItems="center"
          justifyContent="center"
          direction="column"
        >
          <Grid item>
            <CircularProgress color="secondary" />
          </Grid>
        </Grid>
      )}
      {layoutConfig && (
        <ResponsiveReactGridLayout
          style={{ height: "100%" }}
          cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 4 }}
          rowHeight={20}
          onLayoutChange={(newLayout, newLayouts) => {
            _setCurrentModeLayout(newLayouts);
          }}
          layouts={layoutConfig}
          draggableHandle=".drag-handle"
          draggableCancel=".draggableCancel"
          containerPadding={[10, 10]}
          margin={[10, 10]}
        >
          {generateWidgets()}
        </ResponsiveReactGridLayout>
      )}
    </>
  );
});

const Container = () => {
  const { bg, themeColor } = useContext(PrefContext);
  const { _removeModeWidget } = useContext(ModeContext);
  const [showSettings, setShowSettings] = useState(false);

  const theme = useMemo(() => {
    return themes.filter((theme) => {
      return theme.id === bg;
    });
  }, [bg]);

  const background = useMemo(() => {
    if (theme[0].background) {
      return backgrounds(`./${bg}.jpg`);
    } else {
      return false;
    }
  }, [bg]);

  const backgroundStyle = useMemo(() => {
    if (background) {
      return {
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        position: "fixed" as 'fixed',
        width: "100%",
        height: "100%",
      };
    } else {
      return {
        position: "fixed" as 'fixed',
        width: "100%",
        height: "100%"
      };
    }
  }, [bg]);

  useEffect(() => {
    const eventListener = getEventListener<MarqueeEvents>();
    eventListener.on('openSettings', () => setShowSettings(true));
    eventListener.on('removeWidget', (name: string) => _removeModeWidget(name));
  }, []);

  return (
    <div className={`appContainer`} style={backgroundStyle}>
      {showSettings && <SettingsDialog close={() => setShowSettings(false)} />}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100vw",
          zIndex: 1000,
        }}
      >
        <Navigation />
      </div>
      <Grid
        container
        style={{
          height: "100vh",
          width: "100vw",
          overflow: "auto",
          background: `rgba(${themeColor.r}, ${themeColor.g}, ${themeColor.b}, ${themeColor.a})`,
        }}
        direction="column"
        wrap="nowrap"
      >
        <Grid item style={{ maxWidth: "100%", width: "100%" }}>
          <div style={{ visibility: "hidden" }}>
            <Navigation />
          </div>
        </Grid>

        <Grid item xs>
          <WidgetLayout />
        </Grid>
      </Grid>
    </div>
  );
};

export default React.memo(Container);