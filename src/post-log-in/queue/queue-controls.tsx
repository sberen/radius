import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import ToggleButton from 'react-bootstrap/ToggleButton';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import {postQueue, pushNotifications} from '../../util/api-functions';
import {Queue, Party} from '../../util/queue';

interface QueueControlsProps {
  queue: Queue, // the current queue
  clear: () => void, // clears the queue
}

/**
 * Sets the 'open' field of the given queue to true.
 * @param {Queue} queue The queue to be opened.
 * @param {function(Queue)} setQueue the function that
 * sets the top level queue
 */
const openQueue = (queue: Queue) => {
  const newQ : Queue = new Queue(queue.uid, true, queue.parties);
  postQueue(newQ);
};

/**
 * Sets the 'open' field of the given queue to false.
 * @param {Queue} queue The queue to be opened.
 * @param {function(Queue)} setQueue
 */
const closeQueue = (queue: Queue) => {
  const newQ : Queue = new Queue(queue.uid, false, queue.parties);
  postQueue(newQ);
};

/**
 * A Card displaying the queue controls: Open/Close/Clear queue and
 * send message to all in queue.
 * TODO: implement send message to all in queue.
 * @param {QueueControlsProps} QueueControlsProps The current queue on
 * the page and access to functions to set it and clear it.
 * @return {jsx} A React Bootstrap Card filled with the controls for the
 * displayed queue.
 */
const QueueControls = ({queue, clear}: QueueControlsProps) => {
  const [message, setMessage] = useState<string>('');

  const sendMessage = async () => {
    const newParties = queue.parties.slice();
    const date = new Date();
    const messages : string[] = [];
    newParties.forEach(async (val: Party) => {
      val.messages.push([date, message]);
      if (val.pushToken) {
        messages.push(val.pushToken);
      }
    });
    const newQ: Queue = new Queue(queue.uid, queue.open, newParties);
    setMessage('');
    await pushNotifications(message, messages);
    await postQueue(newQ);
  };

  const selectedOpenClosed: string = queue.open ? 'open' : 'closed';
  return (
    <Card id='control-group-card'>
      <Card.Body >
        <div id='control-button-group'>
          <ToggleButtonGroup
            name='open-close'
            type='radio'
            defaultValue={selectedOpenClosed}
            id = 'open-close-buttons'
          >
            <ToggleButton
              value='open'
              onChange={() => openQueue(queue)}
              checked={queue.open}
              variant={'secondary'}
            >
              Open Queue
            </ToggleButton>
            <ToggleButton
              value='closed'
              onChange={() => closeQueue(queue)}
              variant={'secondary'}
            >
              Close Queue
            </ToggleButton>
          </ToggleButtonGroup>

          <Button id='clear-button' variant='danger' onClick={() => clear()}>
            Clear Queue
          </Button>
        </div>
        <Form.Group style={{textAlign: 'center'}}>
          <Form.Control
            as='textarea'
            placeholder='Type a Message'
            rows={3}
            id='messanger'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button
            id='control-message-button'
            onClick={() => sendMessage()}
            className={'button'}
          >
            Send Message to All
          </Button>
        </Form.Group>
      </Card.Body>
    </Card>
  );
};

QueueControls.propTypes = {
  queue: PropTypes.object,
  setQueue: PropTypes.func,
  clear: PropTypes.func,
};

export default QueueControls;
