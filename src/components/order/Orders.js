

function Orders({ user }) {
    return (
      <section className="orders">
        <h1>New Orders</h1>
        {user && user.user_fname}
      </section>
    );
  }
  

export default Orders