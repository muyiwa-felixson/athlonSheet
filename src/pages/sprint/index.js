import React, { useContext } from 'react';
import { UserContext } from '../../App';
import { Timeline, Tag } from 'antd';
import { Box } from '../../components/layout.style';
import { TimeZone } from '../../components/caterpillar.style';
import { Header } from '../../components/header.style';
import dayjs from 'dayjs';
import { sprintDuration } from '../../utility/util';
import { SprintContainer } from '../../components/sprintLoad.style';

const SprintSheet = () => {
  const { invoice } = useContext(UserContext);
  const project = invoice.get.project || {};
  const extracost = invoice.get.extracost || {};

  const spreadSprint = () => {
    const { sprints, billrate, billcycle, date } = project;
    const spread = [];
    for (let i = 0; i < sprints; i++) {
      const sprintMembers = invoice.get.members || [];
      const sprintDate = date;
      const discount = extracost.discount;
      const discountValue = extracost.discountValue;
      const discountAt = extracost.discountAt;
      const sprintCost = 0;

      spread.push({
        sprint: i + 1,
        billEnd: billcycle === 'end' && (i % billrate === billrate - 1 || i + 1 === sprints),
        billStart: billcycle === 'start' && i % billrate === 0,
        date: dayjs(sprintDate, 'DD/MM/YYYY').add(sprintDuration * i, 'day').format('DD/MM/YYYY'),
        cost: sprintCost,
        members: sprintMembers,
        discount: discount && i + 1 >= discountAt ? discountValue : 0
      });
    }
    return spread;
  };

  let items = [];
  const nextFriday = (5 - dayjs(project.date, 'DD/MM/YYYY').day() + 3) % 7;
  project.sprints > 0 &&
    spreadSprint().forEach((e, i) => {
      e.billStart &&
        items.push({
          children: <><Tag color="green">{dayjs(e.date, 'DD/MM/YYYY').format('ddd MMM D, YYYY')}</Tag></>,
          color: 'green',
          position: 'right'
        });
      items.push({
        color: 'blue',
        children: (
          <TimeZone>
            <strong>
              Sprint {e.sprint} {e.discount > 0 && <Tag color="red">{e.discount}%</Tag>}
            </strong>
            <span className="date">{dayjs(e.date, 'DD/MM/YYYY').format('ddd MMM D, YYYY')}</span>
          </TimeZone>
        ),
        position: 'left'
      });
      e.billEnd &&
        items.push({
          children: <Tag color="green">{dayjs(e.date, 'DD/MM/YYYY').add(sprintDuration - 3, 'day').add(nextFriday, 'day').format('ddd MMM D, YYYY')}</Tag>,
          color: 'green',
          position: 'right'
        });
    });

  return (
    <>
      <Header>
        <h4>Sprint Timeline</h4>
      </Header>
      <SprintContainer>
        <Timeline mode="alternate" items={items} />
      </SprintContainer>
    </>
  );
};

export default SprintSheet;
