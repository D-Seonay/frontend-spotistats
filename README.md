# Spotify Stats Dashboard

A modern frontend application built with Next.js to visualize your Spotify streaming data. Import your listening history (CSV or JSON) and explore detailed statistics, top tracks, top artists, and listening patterns with advanced filtering and interactive charts.

## ✨ Features

-   **Data Import:** Easily upload your Spotify streaming history from JSON or CSV files.
-   **Advanced Filtering:** Filter your data by artist, track, date range, and minimum playtime to gain precise insights.
-   **Comprehensive Visualizations:**
    -   **Listening Trends:** Area charts to show listening minutes over time.
    -   **Hourly Activity:** Bar charts to display listening activity by hour of the day.
    -   **Weekday Breakdown:** Pie charts to illustrate listening distribution across weekdays.
    -   **Activity Heatmap:** A GitHub-style heatmap visualizing daily listening activity over the last year.
-   **Top Statistics:** View your top artists and top tracks with play counts and total listening minutes.
-   **Responsive Design:** Optimized for a seamless experience across various devices.

## 💻 Technologies Used

-   **Next.js:** React framework for building fast and scalable web applications.
-   **TypeScript:** Type-safe JavaScript for robust development.
-   **React:** For building interactive user interfaces.
-   **Tailwind CSS:** A utility-first CSS framework for rapid styling.
-   **Lucide React:** A collection of beautiful and customizable open-source icons.
-   **Recharts:** A composable charting library built on React components for data visualization.
-   **Shadcn/ui:** Re-usable components built using Radix UI and Tailwind CSS.

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   Node.js (LTS version recommended)
-   pnpm (or npm/yarn, but pnpm is used in this project)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone git@github.com:D-Seonay/frontend-spotistats.git
    cd frontend-spotistats
    ```
2.  **Install dependencies:**
    ```bash
    pnpm install
    ```
3.  **Run the development server:**
    ```bash
    pnpm dev
    ```
    Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📊 Usage

1.  **Obtain Your Spotify Data:**
    -   Go to [privacy.spotify.com](https://privacy.spotify.com/).
    -   Log in and request your data.
    -   Wait for the email with the download link.
    -   Extract the `StreamingHistory*.json` or `endsong*.json` files.
2.  **Import Data:**
    -   On the dashboard, navigate to the import section.
    -   Drag and drop your Spotify data files (JSON or CSV) or click to select them.
    -   The application will process your data and display your personalized statistics.
3.  **Explore Your Stats:**
    -   Use the advanced filters on the dashboard, "All Artists", and "All Music" pages to refine your data view.
    -   Switch between different chart types to visualize your listening habits from various perspectives.

## 🤝 Contributing

Contributions are welcome! If you have any ideas, suggestions, or bug reports, please open an issue or submit a pull request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details (if applicable).
