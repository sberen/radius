import React, {useState} from 'react';
import {useForm} from '../logic/logic';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import './register.css';
import Col from 'react-bootstrap/Col';
import './../firebase.ts';
import firebase from 'firebase/app';

interface registerValues {
  businessName: string;
  ownerName: string;
  email: string;
  password: string;
  confirm: string;
  address: string;
  hours: string;
  phone: string;
}

interface ValidityState {
  submitted: boolean;
  email: [boolean, string];
  password: [boolean, string];
}

const initialState : ValidityState = {
  submitted: false,
  email: [true, ''],
  password: [true, ''],
};

const RegistrationPage = () => {
  const [formValues, setFormValues] = useForm({businessName: '', ownerName: '',
    email: '', password: '', confirm: '', address: '', hours: '', phone: ''});

  const [validity, setValidity] = useState(initialState);

  const allFieldsCompleted : () => boolean = () => {
    let result : boolean = true;
    for (const field of Object.keys(formValues)) {
      result = result && formValues[field].length > 0;
    }
    return result;
  };

  const validateEmailAndPassword : () => ValidityState = () => {
    const result : ValidityState = {
      submitted: true,
      email: [true, ''],
      password: [true, ''],
    };
    if (formValues.email.split('@').length !== 2) {
      result.email[0] = false;
      result.email[1] = 'Please enter a valid email address.';
    }
    if (formValues.password.length < 6 ||
      formValues.password !== formValues.confirm) {
      result.password[0] = false;
      result.password[1] = formValues.password.length < 6 ?
        'Password must be at least 6 characters.' : 'Passwords do not match.';
    }
    return result;
  };

  const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validityObject : ValidityState = validateEmailAndPassword();
    const fieldsFilled : boolean = allFieldsCompleted();
    if (!!validityObject.password[0] &&
        !!validityObject.email[0] && fieldsFilled) {
      firebase.auth()
          .createUserWithEmailAndPassword(formValues.email, formValues.password)
          .catch(function(error) {
            const errorMessage = error.message;
            if (errorMessage ===
              'The email address is already in use by another account.') {
              setValidity({
                ...validityObject,
                email: [false,
                  'The email address is already in use by another account.'],
              });
            }
          });
    } else {
      setValidity(validityObject);
    }
  };

  return (
    <div id="reg-container">
      <Card bg='dark' text='white' id="reg-card">
        <Card.Title className="form-header-reg">
        Register your business with Radius.</Card.Title>

        <Card.Body>
          <Form noValidate onSubmit={submitForm}>
            <Form.Row>
              <Col>
                <Form.Group controlId="businessName">
                  <Form.Label>Business Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="businessName"
                    value={formValues.businessName}
                    placeholder="Enter name of business here"
                    onChange={setFormValues}
                    isValid={validity.submitted &&
                      formValues.businessName.length > 0}
                    isInvalid={validity.submitted &&
                      formValues.businessName.length === 0}
                  />
                  <Form.Control.Feedback type='invalid'>
                    Please Enter a Business Name
                  </Form.Control.Feedback>
                  <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="ownerName">
                  <Form.Label>Owner Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="ownerName"
                    value={formValues.ownerName}
                    placeholder="Enter name of owner here"
                    onChange={setFormValues}
                    isValid={validity.submitted &&
                      formValues.ownerName.length > 0}
                    isInvalid={validity.submitted &&
                      formValues.ownerName.length === 0}
                  />
                  <Form.Control.Feedback type='invalid'>
                    Please Enter an Owner Name
                  </Form.Control.Feedback>
                  <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Form.Row>

            <Form.Group controlId="email">
              <Form.Label>E-mail</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formValues.email}
                placeholder="account@example.com"
                onChange={setFormValues}
                isInvalid={validity.submitted && !validity.email[0]}
                isValid={validity.submitted && !!validity.email[0]}
              />
              <Form.Control.Feedback type='invalid'>
                {validity.email[1]}
              </Form.Control.Feedback>
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formValues.password}
                placeholder="Enter password here"
                onChange={setFormValues}
                isValid={validity.submitted && !!validity.password[0]}
                isInvalid={validity.submitted && !validity.password[0]}
              />
              <Form.Control.Feedback type='invalid'>
                {validity.password[1]}
              </Form.Control.Feedback>
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="confirm">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                name="confirm"
                value={formValues.confirm}
                placeholder="Confirm password"
                onChange={setFormValues}
                isValid={validity.submitted && !!validity.password[0]}
                isInvalid={validity.submitted && !validity.password[0]}
              />
              <Form.Control.Feedback type='invalid'>
                {validity.password[1]}
              </Form.Control.Feedback>
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="address">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                name="address"
                value={formValues.address}
                placeholder="555 Example Dr. City, Country Zip"
                onChange={setFormValues}
                isInvalid={validity.submitted &&
                  formValues.address.length === 0}
                isValid={validity.submitted &&
                  formValues.address.length > 0}
              />
              <Form.Control.Feedback type='invalid'>
                Please Enter a Location Address
              </Form.Control.Feedback>
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="hours">
              <Form.Label>Hours of Operation</Form.Label>
              <Form.Control
                type="text"
                name="hours"
                value={formValues.hours}
                placeholder="10AM - 12PM"
                onChange={setFormValues}
                isValid={validity.submitted &&
                  formValues.hours.length > 0}
                isInvalid={validity.submitted &&
                  formValues.hours.length === 0}
              />
              <Form.Control.Feedback type='invalid'>
                Please Enter Hours of Operation
              </Form.Control.Feedback>
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="phone">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                value={formValues.phone}
                placeholder="Enter phone number here"
                onChange={setFormValues}
                isInvalid={validity.submitted &&
                  formValues.phone.length === 0}
                isValid={validity.submitted &&
                  formValues.phone.length > 0}
              />
              <Form.Control.Feedback type='invalid'>
                Please Enter A Phone Number
              </Form.Control.Feedback>
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            </Form.Group>
            <Button
              type='submit'
              style={{width: '100%'}}
            >
              Register
            </Button>
          </Form>
        </Card.Body>

      </Card>
    </div>
  );
};

export default RegistrationPage;
