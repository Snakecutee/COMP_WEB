import { useState } from "react";
import Button from "../components/button";
import Form from "../components/form";
import InputField from "../components/inputField";
import Table from "../components/table";
import Modal from "../components/modal";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { login } from "../apiServices";
import SelectOption from "../components/SelectOption";
import DateTimePicker from "../components/DateTimePicker";
import Password from "../components/password";
import TextAreaField from "../components/text-area";
const customerTableHead = [
  "Id",
  "Name",
  "Email",
  "Phone",
  "Total orders",
  "Total spend",
  "Location",
];

const testData = [
  {
    id: 1,
    name: "Brittan Rois",
    email: "brois0@unicef.org",
    location: "Bator",
    phone: "+62 745 807 7685",
    total_spend: "$557248.44",
    total_orders: 24011,
  },
  {
    id: 2,
    name: "Matthew Junifer",
    email: "mjunifer1@buzzfeed.com",
    location: "Bromma",
    phone: "+46 993 722 3008",
    total_spend: "$599864.94",
    total_orders: 60195,
  },
  {
    id: 3,
    name: "Finlay Baylay",
    email: "fbaylay2@purevolume.com",
    location: "Atalaia",
    phone: "+55 232 355 3569",
    total_spend: "$171337.47",
    total_orders: 96328,
  },
  {
    id: 4,
    name: "Beryle Monelli",
    email: "bmonelli3@amazonaws.com",
    location: "Martingança",
    phone: "+351 734 876 8127",
    total_spend: "$335862.78",
    total_orders: 78768,
  },
  {
    id: 5,
    name: "Ilario Shoppee",
    email: "ishoppee4@webmd.com",
    location: "Lincoln",
    phone: "+54 410 442 6083",
    total_spend: "$719845.14",
    total_orders: 26045,
  },
  {
    id: 6,
    name: "Guglielma Haking",
    email: "ghaking5@icio.us",
    location: "Sangzhou",
    phone: "+86 722 902 9706",
    total_spend: "$621446.73",
    total_orders: 90771,
  },
  {
    id: 7,
    name: "Celle Acum",
    email: "cacum6@scribd.com",
    location: "Huzhen",
    phone: "+86 805 547 3640",
    total_spend: "$640651.30",
    total_orders: 97842,
  },
  {
    id: 8,
    name: "Ailey Haig",
    email: "ahaig7@live.com",
    location: "Gizel’",
    phone: "+7 623 158 0485",
    total_spend: "$473255.45",
    total_orders: 85298,
  },
  {
    id: 9,
    name: "Ebonee Robardet",
    email: "erobardet8@google.co.jp",
    location: "Uyugan",
    phone: "+63 406 595 5538",
    total_spend: "$513918.18",
    total_orders: 38959,
  },
  {
    id: 10,
    name: "Nancy Hallatt",
    email: "nhallatt9@tamu.edu",
    location: "Liuhao",
    phone: "+86 194 283 7223",
    total_spend: "$862509.17",
    total_orders: 48049,
  },
  {
    id: 11,
    name: "Savina Gardener",
    email: "sgardenera@mozilla.com",
    location: "Bosanski Brod",
    phone: "+387 494 626 9847",
    total_spend: "$385914.28",
    total_orders: 24961,
  },
  {
    id: 12,
    name: "Walliw Berard",
    email: "wberardb@state.tx.us",
    location: "Athy",
    phone: "+353 884 996 4703",
    total_spend: "$33957.23",
    total_orders: 24986,
  },
  {
    id: 13,
    name: "Bernita Moniker",
    email: "bmonikerc@g.co",
    location: "Conceição da Abóboda",
    phone: "+351 122 281 8005",
    total_spend: "$165782.42",
    total_orders: 38671,
  },
  {
    id: 14,
    name: "Devlen MacGibbon",
    email: "dmacgibbond@mashable.com",
    location: "Manjakandriana",
    phone: "+261 550 422 8564",
    total_spend: "$733558.04",
    total_orders: 5702,
  },
  {
    id: 15,
    name: "Terri O'Nion",
    email: "tonione@msn.com",
    location: "Hadžići",
    phone: "+387 213 246 0301",
    total_spend: "$327313.11",
    total_orders: 7145,
  },
  {
    id: 16,
    name: "Anselm Cavilla",
    email: "acavillaf@live.com",
    location: "Redcliff",
    phone: "+263 941 369 6625",
    total_spend: "$533334.93",
    total_orders: 33108,
  },
  {
    id: 17,
    name: "Frances Wyndham",
    email: "fwyndhamg@nbcnews.com",
    location: "Hekou",
    phone: "+86 922 171 8017",
    total_spend: "$799425.62",
    total_orders: 85286,
  },
  {
    id: 18,
    name: "Bennett Skermer",
    email: "bskermerh@reverbnation.com",
    location: "Sinop",
    phone: "+55 598 223 7882",
    total_spend: "$251319.17",
    total_orders: 45914,
  },
  {
    id: 19,
    name: "Valentine Lambertazzi",
    email: "vlambertazzii@eepurl.com",
    location: "Kolodenka",
    phone: "+380 633 380 2502",
    total_spend: "$640365.13",
    total_orders: 83235,
  },
  {
    id: 20,
    name: "Tremayne Tolchar",
    email: "ttolcharj@auda.org.au",
    location: "Guofu",
    phone: "+86 445 679 1332",
    total_spend: "$917855.01",
    total_orders: 51836,
  },
  {
    id: 21,
    name: "Estevan Jahncke",
    email: "ejahnckek@ox.ac.uk",
    location: "Benešov nad Ploučnicí",
    phone: "+420 856 496 9100",
    total_spend: "$583555.97",
    total_orders: 9523,
  },
  {
    id: 22,
    name: "Inness Ranyelld",
    email: "iranyelldl@i2i.jp",
    location: "Camperdown",
    phone: "+27 913 964 5397",
    total_spend: "$410344.53",
    total_orders: 96017,
  },
  {
    id: 23,
    name: "Ann Boise",
    email: "aboisem@nhs.uk",
    location: "Esuk Oron",
    phone: "+234 958 752 1521",
    total_spend: "$341368.58",
    total_orders: 83833,
  },
  {
    id: 24,
    name: "Reynard Goodacre",
    email: "rgoodacren@opera.com",
    location: "Isoka",
    phone: "+260 860 266 9740",
    total_spend: "$362313.38",
    total_orders: 15703,
  },
];

const loginFormValidationSchema = yup.object({
  username: yup.string().required("Username must be filled"),
  password: yup.string().required("Password must be filled"),
});

const TestScreen = () => {
  const [data, setData] = useState(testData);
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(new Date());

  const handleChange = (e) => {
    console.log(e.target.value);
    setDate(prev => e.target.value);
  }

  const {
    handleSubmit,
  } = useForm({resolver: yupResolver(loginFormValidationSchema)});

  const [selectedValue, setSelectedValue] = useState(data[0].name);

  const submitLoginForm = async (formData) => {
    console.log(formData);
    const {  data } = await login(formData);
    console.log(data);
  };

  const searchByNameExample = (searchParam) => {
    if (searchParam !== "") {
      const filtering = data.filter((item) => item.name.includes(searchParam));
      console.log(searchParam);
      console.log(filtering);
      setData(filtering);
    } else {
      setData(testData);
    }
  };

  const handleSelected = (e) => {
    e.preventDefault();
    setSelectedValue(prev => e.target.value);
    console.log(selectedValue);
  }

  const renderTableHead = (item, index) => (
    <th key={index} class="p-2 whitespace-nowrap">
      <div className="font-semibold text-left">{item}</div>
    </th>
  );

  const renderTableBody = (item, index) => (
    <tr key={index}>
      <td className="p-2 whitespace-nowrap">
        <div className="text-left">{item.id}</div>
      </td>
      <td className="p-2 whitespace-nowrap">
        <div className="text-left">{item.name}</div>
      </td>
      <td className="p-2 whitespace-nowrap">
        <div className="text-left">{item.email}</div>
      </td>
      <td className="p-2 whitespace-nowrap">
        <div className="text-left">{item.phone}</div>
      </td>
      <td className="p-2 whitespace-nowrap">
        <div className="text-left">{item.total_spend}</div>
      </td>
      <td className="p-2 whitespace-nowrap">
        <div className="text-left">{item.total_orders}</div>
      </td>
      <td className="p-2 whitespace-nowrap">
        <div className="text-left">{item.location}</div>
      </td>
    </tr>
  );

  return (
    <div className="w-full my-20">
      <Table
        search={searchByNameExample}
        limit={10}
        tableHead={customerTableHead}
        tableData={data}
        renderData={renderTableBody}
        renderHead={renderTableHead}
        tableTitle={"Test Table"}
        createButtonHandler={() => setOpen(true)}
      />
      <Modal open={open} setOpen={setOpen}>
        <div className="w-full">
          <Form title="Test Form">
            <InputField
              type="text"
              placeholder="Type: Text"
            />
            <Password
              placeholder="Type: Password"
            />
            <TextAreaField rows="3" placeholder="Description" onChange={e => console.log(e.target.value)} />
            <SelectOption onChange={handleSelected} listData={data} defaultValue={selectedValue} />
            <DateTimePicker defaultValue={date} onChange={handleChange} />
            <div className="w-3/5 flex flex-wrap justify-between items-center">
              <Button
                type="primary"
                title="Login"
                role="submit"
                onClick={handleSubmit(submitLoginForm)}
              />
              <Button type="secondary" title="Register" />
            </div>
          </Form>
        </div>
      </Modal>
    </div>
  );
};

export default TestScreen;
