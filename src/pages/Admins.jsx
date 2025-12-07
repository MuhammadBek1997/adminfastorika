import { ChevronLeft, ChevronRight, ChevronsLeft, Plus, Search } from 'lucide-react'
import AdminNavbar from '../components/AdminNavbar.jsx'
import { useGlobalContext } from '../context.js'
import '../styles/Admins.css'

const Admins = () => {
  let { t, theme } = useGlobalContext()

  let dataAdmins = [
    {
      name: "Ivan Ivanov",
      email: 'example@gmail.com'
    },
    {
      name: "Ivan Ivanov",
      email: 'example@gmail.com'
    },
    {
      name: "Maria Petrova",
      email: 'maria.petrova@mail.com'
    },
    {
      name: "Sergey Smirnov",
      email: 'sergey.smirnov@outlook.com'
    },
    {
      name: "Alexander Kuznetsov",
      email: 'alex.kuznetsov@yahoo.com'
    },
    {
      name: "Anna Vasilieva",
      email: 'anna.vasilieva@gmail.com'
    },
    {
      name: "Dmitriy Sokolov",
      email: 'dmitry.sokolov@protonmail.com'
    },
    {
      name: "Elena Mikhaylova",
      email: 'elena.mikhaylova@icloud.com'
    },
    {
      name: "Nikolai Fedorov",
      email: 'nikolai.fedorov@hotmail.com'
    },
    {
      name: "Olga Romanovskaya",
      email: 'olga.romanovskaya@live.com'
    },
    {
      name: "Tolik Trofimov",
      email: 'tolik.trofimov@tutanota.com'
    },
    {
      name: "Svetlana Grigorieva",
      email: 'svetlana.grigorieva@aol.com'
    }
  ]


  return (
    <section className="admin-section" data-theme={`${!theme}`}>
      <div className="section-header">
        <h2 className="section-title">
          {t("admins")}
        </h2>
        <AdminNavbar />
      </div>
      <div className="section-body">
        <div className="wordAndBtn1">
          <div className="forsearch">

            <input type="" className="input" placeholder="Search..." />
            <Search />
          </div>
          <button className="greenBtn">
            <p>
              Add
            </p>
            <Plus />
          </button>
        </div>
        <section className="for-table">
          <div className="all">
            <div className="name-email">
              <div className="name">
                <p>
                  Name
                </p>
                <img src="./images/nameiconw.png" alt="" id="nameicon" />

              </div>
              <div className="email">
                <p>
                  Email
                </p>
                <img src="./images/emailiconw.png" alt="" id="emailicon" />
              </div>
            </div>
            <div className="list" id="list">
              {dataAdmins.map((item, index) => {
                return (
                  <div className="list-item" key={`${index}`}>
                    <div className="list-item-name">
                      <p>
                        {item.name}
                      </p>
                    </div>
                    <div className="list-item-email">
                      <p>
                        {item.email}
                      </p>
                      <ChevronRight />
                    </div>
                  </div>

                )

              })}
            </div>
            <div className="final-mark">
              <div className="marks">
                <div className="mark1">

                  <ChevronsLeft />
                  <p>
                    Back to top
                  </p>
                </div>
                <div className="mark2">
                  <ChevronLeft />
                  <p>
                    Back
                  </p>
                </div>
                <div className="mark3">
                  <p>
                    Next
                  </p>
                  <ChevronRight />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </section>
  )
}

export default Admins
