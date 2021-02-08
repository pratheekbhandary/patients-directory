import { useState, useEffect, useCallback } from "react";
import "@innovaccer/design-system/css";
import { Card, Table } from "@innovaccer/design-system";
import { calculateAge } from "../../util";
import { useHistory } from "react-router-dom";
import { PatientsInterface } from "../../types";

const PatientsTable = () => {
  const [patientsData, setPatientsData] = useState<PatientsInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [paginationInfo, setPaginationInfo] = useState({
    next: null,
    previous: null,
    totalCount: 0,
    limit: 1000,
    page: 1,
  });
  const { push } = useHistory();

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_SERVER_ENDPOINT}/patients?page=1&&limit=1000`
        );
        const { data } = await res.json();

        setPatientsData([...data.results]);
        setPaginationInfo((paginationInfo) => ({
          ...paginationInfo,
          next: data.next ? data.next : null,
          previous: data.previous ? data.previous : null,
          totalCount: data.totalCount != undefined ? data.totalCount : 0,
        }));
      } catch (err) {
        //TODO: notify
        console.error("Could not fetch patients data", err);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const onRowClick = useCallback((data) => {
    data && push(`/patient/${data.id}`);
  }, []);

  const schema = [
    {
      name: "name",
      displayName: "Name",
      width: "30%",
      resizable: true,
      separator: true,
      tooltip: true,
      translate: (a: { first_name: any; last_name: any }) => ({
        title: `${a.first_name} ${a.last_name}`,
        firstName: a.first_name,
        lastName: a.last_name,
      }),
      cellType: "AVATAR_WITH_TEXT",
      align: "right",
    },
    {
      name: "email",
      displayName: "Email",
      width: 250,
      resizable: true,
      sorting: false,
      cellType: "WITH_META_LIST",
    },
    {
      name: "gender",
      displayName: "Gender",
      width: 150,
      resizable: true,
      comparator: (a: { gender: string }, b: { gender: any }) =>
        a.gender.localeCompare(b.gender),
      cellType: "DEFAULT",
      translate: (a: { gender: string }) => ({
        title: a.gender === "FEMALE" ? "female" : "male",
      }),
    },
    {
      name: "city",
      displayName: "City",
      width: 200,
      resizable: true,
      cellType: "DEFAULT",
    },
    {
      name: "dob",
      displayName: "Age",
      width: 150,
      resizable: true,
      cellType: "DEFAULT",
      translate: (a: { dob: string }) => ({
        title: calculateAge(a.dob),
      }),
    },
    {
      name: "phone_no",
      displayName: "Contact",
      width: 200,
      resizable: true,
      cellType: "DEFAULT",
    },
  ];

  const loaderSchema = [
    {
      name: "name",
      displayName: "Name",
      width: "30%",
      resizable: true,
      tooltip: true,
      separator: true,
      cellType: "AVATAR_WITH_TEXT",
    },
    {
      name: "email",
      displayName: "Email",
      width: 250,
      resizable: true,
      sorting: false,
      cellType: "DEFAULT",
    },
    {
      name: "gender",
      displayName: "Gender",
      width: 150,
      resizable: true,
      cellType: "STATUS_HINT",
    },
    {
      name: "city",
      displayName: "City",
      width: 150,
      resizable: true,
      cellType: "DEFAULT",
    },
    {
      name: "dob",
      displayName: "Age",
      width: 150,
      resizable: true,
      cellType: "DEFAULT",
    },
    {
      name: "contact",
      displayName: "Contact",
      width: 200,
      resizable: true,
      cellType: "DEFAULT",
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Card className="h-100 overflow-hidden" style={{ width: "95vw" }}>
        <Table
          type="resource"
          loading={loading}
          //@ts-ignore
          loaderSchema={loaderSchema}
          data={patientsData}
          //@ts-ignore
          schema={schema}
          withHeader={true}
          headerOptions={{
            withSearch: true,
          }}
          onSearch={(currData, searchTerm) => {
            return currData.filter(
              (d) =>
                d.first_name.toLowerCase().match(searchTerm.toLowerCase()) ||
                d.last_name.toLowerCase().match(searchTerm.toLowerCase())
            );
          }}
          withCheckbox={false}
          onSelect={(rowIndex, selected, selectedList, selectAll) =>
            console.log(
              `on-select:- rowIndex: ${rowIndex} selected: ${selected} selectedList: ${JSON.stringify(
                selectedList
              )} selectAll: ${selectAll}`
            )
          }
          withPagination={true}
          pageSize={5}
          page={paginationInfo.page}
          paginationType="jump"
          totalCount={paginationInfo.totalCount}
          onPageChange={(newPage) => console.log(`on-page-change:- ${newPage}`)}
          onRowClick={onRowClick}
        />
      </Card>
    </div>
  );
};

export default PatientsTable;
