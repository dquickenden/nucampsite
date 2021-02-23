/* eslint-disable react/jsx-pascal-case */
import React, { Component } from "react";
import {
  Card,
  CardImg,
  CardBody,
  CardText,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Input,
  Label,
} from "reactstrap";
import { Link } from "react-router-dom";
import { Control, Errors, LocalForm } from "react-redux-form";
import { Loading } from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';
import { FadeTransform, Fade, Stagger } from 'react-animation-components';

const maxLength = (len) => (val) => !val || val.length <= len;
const minLength = (len) => (val) => val && val.length >= len;

function RenderCampsite({ campsite }) {
  return (
    <div className="col-5 m-1">
      <FadeTransform
        in
        transformProps={{ exitTranform: "scale(0.5) translateY(-50%)" }}
      >
        <Card>
          <CardImg top src={baseUrl + campsite.image} alt={campsite.name} />
          <CardBody>
            <CardText>{campsite.description}</CardText>
          </CardBody>
        </Card>
      </FadeTransform>
    </div>
  );
}

function RenderComments({ comments, postComment, campsiteId }) {
  if (comments) {
    return (
      <div className="col-md-5 m-1">
        <h4>Comments: </h4>
        <Stagger in>
          {comments.map((comment) => {
            return (
              <Fade in key={comment.id}>
                <div>
                  <p>
                    {comment.text} <br />
                    {comment.author},
                    {new Intl.DateTimeFormat("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "2-digit",
                    }).format(new Date(Date.parse(comment.date)))}
                  </p>
                </div>
              </Fade>
            );
          })}
        </Stagger>
        <CommentForm campsiteId={campsiteId} postComment={postComment} />
      </div>
    );
  } else {
    <div />;
  }
}

function CampsiteInfo(props) {
  if (props.isLoading) {
    return (
      <div className="container">
        <div className="row">
          <Loading />
        </div>
      </div>
    );
  }
  if (props.errMess) { 
    return (
      <div className="container">
        <div className="row">
          <div className="col">
            <h4>{ props.errMess }</h4>
          </div>
        </div>
      </div>
    );
  }
    if (props.campsite) {
      return (
        <div className="container">
          <div className="row">
            <div className="col">
              <Breadcrumb>
                <BreadcrumbItem>
                  <Link to="/directory">Directory</Link>
                </BreadcrumbItem>
                <BreadcrumbItem active>{ props.campsite.name }</BreadcrumbItem>
              </Breadcrumb>
              <h2>{ props.campsite.name }</h2>
              <hr/>
            </div>
          </div>
          <div className="container">
            <div className="row">
              <div className="col">
                <RenderCampsite campsite={ props.campsite } />
                <RenderComments
                  comments={ props.comments }
                  postComment={ props.postComment }
                  campsiteId={ props.campsite.id }
                />
              </div>
            </div>
          </div>
        </div>
      );
    }
  return <div />;
}

class CommentForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isModalOpen: false,
    };

    this.toggleModal = this.toggleModal.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  toggleModal() {
    this.setState({
      isModalOpen: !this.state.isModalOpen,
    });
  }

  handleSubmit(values) {
    this.toggleModal();
    this.props.postComment(
      this.props.campsiteId,
      values.rating,
      values.author,
      values.text
    );
  }

  render() {
    return (
      <React.Fragment>
        <div className="row row-content align-items-center">
          <div className="col">
            <Button outline onClick={this.toggleModal}>
              <i className="btn btn-link fa fa-pencil" />
              Submit Comment
            </Button>
          </div>
        </div>

        <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
          <ModalHeader toggle={this.toggleModal}>Submit Comment</ModalHeader>
          <ModalBody>
            <LocalForm onSubmit={(values) => this.handleSubmit(values)}>
              <div className="form-group">
                <Label htmlFor="rating">Rating</Label>
                <Control.select
                  model=".rating"
                  name="rating"
                  placeholder="Rating"
                  className="form-control"
                >
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                  <option>5</option>
                </Control.select>
              </div>
              <div className="form-group">
                <Label htmlFor="author">Author</Label>
                <Control.text
                  model=".author"
                  id="author"
                  name="author"
                  placeholder="Author"
                  className="form-control"
                  validators={{
                    minLength: minLength(2),
                    maxLength: maxLength(15),
                  }}
                />
                <Errors
                  model=".author"
                  className="text-danger"
                  show="touched"
                  component="div"
                  messages={{
                    minLength: "Must be at least 2 characters",
                    maxLength: "Must be 15 characters or less",
                  }}
                />
              </div>
              <div className="form-group">
                <Label htmlFor="text">Text </Label>
                <Input
                  model=".text"
                  type="text"
                  name="text"
                  innerRef={(input) => (this.text = input)}
                />
              </div>
              <Button type="submit" value="submit" color="primary">
                Submit
              </Button>
            </LocalForm>
          </ModalBody>
        </Modal>
      </React.Fragment>
    );
  }
}

export default CampsiteInfo;
