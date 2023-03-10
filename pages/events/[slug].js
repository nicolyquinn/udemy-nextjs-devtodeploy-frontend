import React from "react";
import Layout from "@/components/Layout";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_URL } from "@/config/index";
import styles from "@/styles/Event.module.css";
import Link from "next/link";
import Image from "next/image";
import { FaPencilAlt, FaTimes } from "react-icons/fa";
import { useRouter } from "next/router";

export default function EventPage({ evt }) {
  const router = useRouter();

  const deleteEvent = async (e) => {
    if (confirm("Are you sure?")) {
      const res = await fetch(`${API_URL}/api/events/${evt.id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message);
      } else {
        router.push("/events");
      }
    }
  };

  if (evt !== undefined) {
    const { attributes } = evt;

    return (
      <Layout>
        <div className={styles.event}>
          <div className={styles.controls}>
            <Link href={`/events/edit/${evt.id}`}>
              <a>
                <FaPencilAlt />
                Edit event
              </a>
            </Link>
            <a className={styles.delete} onClick={deleteEvent}>
              <FaTimes /> Delete Event
            </a>
          </div>
          <span>
            {new Date(attributes.date).toLocaleDateString("pt-BR")} at{" "}
            {attributes.time}
          </span>
          <h1>{attributes.name}</h1>
          <ToastContainer />
          {evt.image && (
            <div className={styles.image}>
              <Image
                src={attributes.image.data.attributes.formats.medium.url}
                width={960}
                height={600}
              />
            </div>
          )}
          <h3>Performers: </h3>
          <p>{attributes.performers}</p>
          <h3>Description: </h3>
          <p>{attributes.description}</p>
          <h3>Venue: {attributes.venue}</h3>
          <p>{attributes.address}</p>

          <Link href="/events">
            <a className={styles.back}>{"<"} Go back</a>
          </Link>
        </div>
      </Layout>
    );
  }
}

export async function getServerSideProps(
  // params coming from getStaticPaths
  { params: { slug } }
) {
  // const res = await fetch(`${API_URL}/api/events/${slug}`);
  const res = await fetch(
    `${API_URL}/api/events?filters[slug]slug=${slug}&populate=*`
  );
  const eventsData = await res.json();
  const events = await eventsData.data;
  return {
    props: { evt: events[0] },
  };
}
