import * as React from "react";

import "../css/ui/modeSwitcher.css";

interface IModeSwitcherProps {
  mode: "TEACH" | "LEARN";
  onClick: () => void;
}

export class ModeSwitcher extends React.Component<IModeSwitcherProps, {}> {
  constructor(props: IModeSwitcherProps) {
    super(props);
  }

  public render() {
    return (
      <div id="mode-switch" className={"center-contents"}>
        <div id="mode-prompt">
          I want to
          <span style={{ position: "absolute", right: "-80px", top: "-2px" }}>
            :
          </span>
        </div>
        <div
          className={
            this.props.mode === "LEARN" ? "switcher top" : "switcher bottom"
          }
        >
          <div
            onClick={this.props.onClick}
            className={
              this.props.mode === "LEARN" ? "option" : "option deselected"
            }
          >
            LEARN
          </div>
          <div
            onClick={this.props.onClick}
            className={
              this.props.mode === "TEACH" ? "option" : "option deselected"
            }
          >
            TEACH
          </div>
        </div>
      </div>
    );
  }
}
