import Link from "next/link";
import Layout from "@/components/Layout";
import EventItem from "@/components/EventItem";
import { API_URL } from "@/config/index";

export default function HomePage({ events }) {
  console.log("events", events);

  return (
    <Layout>
      <h1>Upcoming Events</h1>
      {events.length === 0 && <h3>No events to show</h3>}
      {events.map((evt) => (
        <EventItem key={evt.id} evt={evt} />
      ))}
      {events.length > 0 && (
        <Link href="/events">
          <a className="btn-secondary">View All Events</a>
        </Link>
      )}
    </Layout>
  );
}

export async function getStaticProps() {
  const res = await fetch(
    `${API_URL}/api/events?populate=*&pagination[pageSize]=3&sort=date:asc`
  );
  const events = await res.json();

  return {
    props: { events: events.data },
    revalidate: 1,
  };
}

/* question with the right code for strap v4 
https://www.udemy.com/course/nextjs-dev-to-deployment/learn/lecture/26055354#questions/17395274
*/
