import * as React from 'react';
import { Colors } from '../Colors';
import { GraphController } from '../Graph';
import { CodeEditor, CodeEditorOuterProps } from './Code';
import * as styles from './style/Editor';
export interface EditorState {
  projectId?: string;
  code: string;
  errors: string;
}
export type EditorProps = {
  editorVisible: boolean;
  graphController?: (controller: GraphController) => void;
} & CodeEditorOuterProps;

export class Editor extends React.Component<EditorProps, EditorState> {
  state: EditorState = {
    projectId: undefined,
    code: '',
    errors: ""
  };
  controller: GraphController = new GraphController();
  private containerRef = React.createRef<HTMLDivElement>();
  receiveSchema = (code: string) => {
    this.setState({ code, errors: "" });
  }
  receiveErrors = (errors: string) => {
    this.setState({ errors });
  }
  componentDidMount() {
    if (!this.containerRef.current) {
      return;
    }
    this.controller.setDOMElement(this.containerRef.current);
    this.controller.setPassSchema(this.receiveSchema);
    this.controller.setPassDiagramErrors(this.receiveErrors);
    if (this.props.graphController) { this.props.graphController(this.controller); }
  }
  componentDidUpdate(prevProps: EditorProps) {
    if (this.props.editorVisible !== prevProps.editorVisible) {
      this.controller.resizeDiagram();
    }
  }
  render() {
    return (
      <>
        {this.props.editorVisible === true && (
          <CodeEditor
            controller={this.controller}
            schema={this.state.code}
            schemaChanged={(e) => {
              this.setState({
                code: e
              });
              if (this.props.schemaChanged) { this.props.schemaChanged(e); }
            }}
          />
        )}
        <div
          style={{
            maxHeight: '100%',
            maxWidth: '100%'
          }}
          ref={this.containerRef}
        />
        {this.state.errors && <div className={styles.ErrorContainer}>{this.state.errors}</div>}
        {this.controller &&
          this.controller.isEmpty() && (
            <div
              style={{
                position: 'fixed',
                width: '100%',
                bottom: 180,
                display: 'flex',
                pointerEvents: 'none',
                justifyContent: 'center'
              }}
            >
              <div
                style={{
                  padding: 30,
                  width: 400,
                  background: Colors.yellow[0],
                  color: Colors.grey[7],
                  fontWeight: 'bold',
                  textAlign: 'justify',
                  borderRadius: 5
                }}
              >
                Press right mouse button anywhere to open menu. You can also write GraphQL code or
                load a project.
              </div>
            </div>
          )}
      </>
    );
  }
}
